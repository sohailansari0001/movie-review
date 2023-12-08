import AuthProvider from "./AuthProvider";
import MoviesProvider from "./MoviesProvider";
import SearchProvider from "./SearchProvider";
import ThemeProvider from "./ThemeProvider";

const ContextProviders = ({ children }) => {
  return (
    <AuthProvider>
      <MoviesProvider>
        <SearchProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SearchProvider>
      </MoviesProvider>
    </AuthProvider>
  );
};

export default ContextProviders;
