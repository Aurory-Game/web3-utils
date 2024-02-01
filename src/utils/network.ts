import https from "https";

export const loadJsonFromUri = async (uri: string) => {
  return new Promise((resolve, reject) => {
    https
      .get(uri, (response) => {
        if (
          response.statusCode === 301 ||
          (response.statusCode === 302 && response.headers.location)
        ) {
          return resolve(loadJsonFromUri(response.headers.location!));
        }
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
