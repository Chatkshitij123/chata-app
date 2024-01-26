// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/";

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, "app"),
  },
};
//that is basically defining constants that we can easily access from anywhere inside our application
//app
// what is the path functon actually doing it is taking root and sublink and combining them to return the string
//PATH_DASHBOARD.general.app
