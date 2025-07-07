export const baseBackendURL =
    process.env.NODE_ENV === "development"
        ? `${window.location.protocol}//${window.location.hostname}:${process.env.SERVER_PORT}`
        : process.env.NODE_ENV === "test"
          ? "test url"
          : process.env.NODE_ENV === "production"
            ? "production url "
            : "invalid url";
