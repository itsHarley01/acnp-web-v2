import { NavLink } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <p>404</p>
      <p>page not found</p>
      <NavLink to="/">back</NavLink>
    </div>
  );
}

export default PageNotFound;
