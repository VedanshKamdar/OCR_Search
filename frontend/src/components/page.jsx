import PropTypes from 'prop-types';

import DashboardHeader from './dashboardHeader';

const Page = ({ children }) => {
  return (
    <div>
      <DashboardHeader />
      <div>{children}</div>
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
