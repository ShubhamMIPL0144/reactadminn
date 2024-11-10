import React from 'react';



const StatisticsDashboard = ({userActivityDetails}) => {
  return (
    <div className="table-responsive">
    <table className="table table-bordered table-striped">
        <thead>
            <tr>
                <th scope="col">Admin</th>
                <th scope="col">Sub-Admin</th>
                <th scope="col">Coach</th>
                <th scope="col">Sub-Coach</th>
                <th scope="col">Registered Users</th>
                <th scope="col">Unregistered Users</th>
            </tr>
        </thead>
        <tbody>
            {/* Add table rows here */}
            <tr>
                <td>{userActivityDetails?.admin}</td>
                <td>{userActivityDetails?.subAdmin}</td>
                <td>{userActivityDetails?.coach}</td>
                <td>{userActivityDetails?.subCoach}</td>
                <td>{userActivityDetails?.register}</td>
                <td>{userActivityDetails?.unregister}</td>
            </tr>
            {/* Add more rows if needed */}
        </tbody>
    </table>
</div>
      
  );
};

export default StatisticsDashboard;
