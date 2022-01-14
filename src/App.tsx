import { lazy, ReactNode, Suspense } from 'react';
import {
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom';

const HomePage = lazy(() => import('./components/HomePage/HomePage'));
const DetailPage = lazy(() => import('./components/DetailPage/DetailPage'));
const CollectionPage = lazy(() => import('./components/CollectionPage/CollectionPage'));
const Page404 = lazy(() => import('./components/Page404/Page404'));

type IRoute = {
  path: string;
  element?: ReactNode;
  child?: IRoute;
};

const generateRoute = (route: IRoute) => (
  <Route
    key={route.path}
    path={route.path}
    element={route.element
      ? (
        <Suspense fallback={<div />}>
          {route.element}
        </Suspense>
      )
      : (<Outlet />)}
  >
    {route.child && generateRoute(route.child)}
  </Route>
);

const routes: IRoute[] = [
  {
    path: 'detail',
    child: {
      path: ':name',
      element: <DetailPage />,
    },
  },
  {
    path: 'collection',
    element: <CollectionPage />,
  },
  {
    path: '404',
    element: <Page404 />,
  },
];

const App = () => (
  <div id="app">
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route
          index
          element={(
            <Suspense fallback={<div />}>
              <HomePage />
            </Suspense>
          )}
        />
        {routes.map((route) => (
          generateRoute(route)
        ))}
        <Route path="*" element={<Navigate replace to="404" />} />
      </Route>
    </Routes>
  </div>
);

export default App;
