// ============================================================
// Campus Placement Cell — AngularJS module
// Shared across jobs.html, drives.html and student-dashboard.html
// Uses: ng-app, ng-controller, ng-repeat, ng-bind, ng-model,
//       ng-if, ng-click, and Angular's built-in `filter` filter.
// ============================================================

var placementApp = angular.module('placementApp', []);

// ---------- jobs.html ----------
placementApp.controller('JobsController', function ($scope) {
  $scope.jobs = [
    {
      file: 'File 118-A', mark: 'MT', company: 'Meridian Tech', category: 'Software',
      role: 'Software Engineer — New Grad', ctc: '\u20B918\u201322 LPA',
      branch: 'cse', branchLabel: 'CSE / IT', location: 'Bengaluru',
      type: 'software', desc: 'Full-stack role on the payments platform team; six-month rotation before permanent placement.',
      cgpa: 'CGPA 7.5+', closes: 'Closes 28 Jul',
      status: 'Closing soon', statusClass: 'stamp-closing',
      search: 'meridian tech software engineer'
    },
    {
      file: 'File 121-B', mark: 'HV', company: 'Harborview Analytics', category: 'Data / Analytics',
      role: 'Data Analyst Trainee', ctc: '\u20B99\u201311 LPA',
      branch: 'all branches', branchLabel: 'All branches', location: 'Pune',
      type: 'analytics', desc: 'Twelve-week certified training programme followed by placement into a client analytics pod.',
      cgpa: 'CGPA 6.5+', closes: 'Closes 4 Aug',
      status: 'Open', statusClass: 'stamp-open',
      search: 'harborview analytics data analyst'
    },
    {
      file: 'File 109-C', mark: 'FL', company: 'Fenwick Logistics', category: 'Operations',
      role: 'Operations Management Trainee', ctc: '\u20B97.2 LPA',
      branch: 'mech', branchLabel: 'Mech / Prod / Civil', location: 'Chennai',
      type: 'core', desc: 'Rotational placement across warehousing, fleet planning and vendor operations.',
      cgpa: 'CGPA 6.0+', closes: 'Closes 12 Aug',
      status: 'Open', statusClass: 'stamp-open',
      search: 'fenwick logistics operations'
    },
    {
      file: 'File 130-A', mark: 'QS', company: 'QuantStack', category: 'Fintech',
      role: 'Backend Developer', ctc: '\u20B924 LPA',
      branch: 'cse', branchLabel: 'CSE / IT', location: 'Hyderabad',
      type: 'software', desc: 'Building settlement systems for a high-frequency trading desk. Strong DSA round expected.',
      cgpa: 'CGPA 8.0+', closes: 'Closes 6 Aug',
      status: 'Open', statusClass: 'stamp-open',
      search: 'quantstack backend developer'
    },
    {
      file: 'File 112-D', mark: 'OP', company: 'Orbitpoint Semiconductors', category: 'Hardware',
      role: 'VLSI Design Engineer', ctc: '\u20B915 LPA',
      branch: 'ece', branchLabel: 'ECE / EEE', location: 'Noida',
      type: 'core', desc: 'Applications closed for this cycle. Reopens for the next placement season.',
      cgpa: 'CGPA 7.0+', closes: 'Closed 15 Jul',
      status: 'Closed', statusClass: 'stamp-closed',
      search: 'orbitpoint semiconductor design'
    },
    {
      file: 'File 140-A', mark: 'CC', company: 'Claremont Capital', category: 'Finance',
      role: 'Financial Analyst — Graduate Programme', ctc: '\u20B912 LPA',
      branch: 'all branches', branchLabel: 'All branches', location: 'Mumbai',
      type: 'finance', desc: 'Two-year rotational programme across risk, treasury and investment research desks.',
      cgpa: 'CGPA 7.0+', closes: 'Closes 20 Aug',
      status: 'Open', statusClass: 'stamp-open',
      search: 'claremont capital finance analyst'
    }
  ];

  $scope.branchFilter = '';
  $scope.typeFilter = '';
  $scope.searchText = '';

  // Custom predicate function used with Angular's `filter` filter
  $scope.matchesFilters = function (job) {
    var branchOk = !$scope.branchFilter || job.branch.indexOf($scope.branchFilter) !== -1;
    var typeOk = !$scope.typeFilter || job.type === $scope.typeFilter;
    var searchOk = !$scope.searchText || job.search.indexOf($scope.searchText.toLowerCase()) !== -1;
    return branchOk && typeOk && searchOk;
  };
});

// ---------- drives.html ----------
placementApp.controller('DrivesController', function ($scope) {
  $scope.drives = [
    { date: '24 Jul', company: 'Meridian Tech', role: 'Software Engineer', stage: 'Online assessment', eligibility: 'CSE / IT, CGPA 7.5+', status: 'Open', statusClass: 'stamp-open' },
    { date: '28 Jul', company: 'Meridian Tech', role: 'Software Engineer', stage: 'Applications close', eligibility: 'CSE / IT, CGPA 7.5+', status: 'Closing', statusClass: 'stamp-closing' },
    { date: '30 Jul', company: 'Meridian Tech', role: 'Software Engineer', stage: 'Technical interviews', eligibility: 'Shortlisted only', status: 'Scheduled', statusClass: 'stamp-open' },
    { date: '4 Aug', company: 'Harborview Analytics', role: 'Data Analyst Trainee', stage: 'Applications close', eligibility: 'All branches, CGPA 6.5+', status: 'Open', statusClass: 'stamp-open' },
    { date: '6 Aug', company: 'QuantStack', role: 'Backend Developer', stage: 'Applications close', eligibility: 'CSE / IT, CGPA 8.0+', status: 'Open', statusClass: 'stamp-open' },
    { date: '12 Aug', company: 'Fenwick Logistics', role: 'Ops Management Trainee', stage: 'Applications close', eligibility: 'Mech / Prod / Civil, CGPA 6.0+', status: 'Open', statusClass: 'stamp-open' },
    { date: '20 Aug', company: 'Claremont Capital', role: 'Financial Analyst', stage: 'Applications close', eligibility: 'All branches, CGPA 7.0+', status: 'Open', statusClass: 'stamp-open' },
    { date: '15 Jul', company: 'Orbitpoint Semiconductors', role: 'VLSI Design Engineer', stage: 'Offers issued', eligibility: 'ECE / EEE, CGPA 7.0+', status: 'Closed', statusClass: 'stamp-closed' }
  ];

  $scope.statusFilter = '';
  $scope.driveSearch = '';

  $scope.matchesDriveFilters = function (d) {
    var statusOk = !$scope.statusFilter || d.status === $scope.statusFilter;
    var searchOk = !$scope.driveSearch ||
      (d.company + ' ' + d.role).toLowerCase().indexOf($scope.driveSearch.toLowerCase()) !== -1;
    return statusOk && searchOk;
  };
});

// ---------- student-dashboard.html ----------
placementApp.controller('DashboardController', function ($scope) {
  $scope.applications = [
    { company: 'Meridian Tech', role: 'Software Engineer', applied: '14 Jul', status: 'Shortlisted', statusClass: 'stamp-shortlisted' },
    { company: 'QuantStack', role: 'Backend Developer', applied: '12 Jul', status: 'Applied', statusClass: 'stamp-applied' },
    { company: 'Harborview Analytics', role: 'Data Analyst Trainee', applied: '9 Jul', status: 'Shortlisted', statusClass: 'stamp-shortlisted' },
    { company: 'Fenwick Logistics', role: 'Ops Management Trainee', applied: '2 Jul', status: 'Not selected', statusClass: 'stamp-rejected' },
    { company: 'Orbitpoint Semiconductors', role: 'VLSI Design Engineer', applied: '28 Jun', status: 'Selected', statusClass: 'stamp-selected' },
    { company: 'Claremont Capital', role: 'Financial Analyst', applied: '24 Jun', status: 'Not selected', statusClass: 'stamp-rejected' }
  ];

  $scope.statusFilter = '';

  // Simple helper used for the stat counters at the top of the page
  $scope.countByStatus = function (status) {
    var count = 0;
    angular.forEach($scope.applications, function (a) {
      if (a.status === status) count++;
    });
    return count;
  };
});


// Recruiter Factory


placementApp.factory("RecruiterFactory", function () {

    var jobs = [

        {
            id: 101,
            company: "Meridian Tech",
            role: "Software Engineer",
            salary: 1800000,
            location: "Bangalore",
            branch: "CSE / IT",
            cgpa: 7.5
        },

        {
            id: 102,
            company: "Harborview Analytics",
            role: "Data Analyst",
            salary: 900000,
            location: "Pune",
            branch: "All Branches",
            cgpa: 6.5
        },

        {
            id: 103,
            company: "QuantStack",
            role: "Backend Developer",
            salary: 1500000,
            location: "Chennai",
            branch: "CSE / IT",
            cgpa: 8.0
        }

    ];

    return {

        getJobs: function () {

            return jobs;

        }

    };

});



// Recruiter Controller


placementApp.controller("RecruiterController",

function (

$scope,

RecruiterFactory

) {


// Recruiter Details

$scope.recruiter = {

company: "Meridian Tech",

name: "Recruitment Team"

};


// Dashboard Cards

$scope.applications = 286;

$scope.selected = 52;

$scope.rejected = 18;


// Load Jobs

$scope.jobs = RecruiterFactory.getJobs();


// Form Models

$scope.newJob = {};

$scope.selectedJob = {};



// ADD 


$scope.addJob = function () {

if (

!$scope.newJob.company ||

!$scope.newJob.role ||

!$scope.newJob.salary ||

!$scope.newJob.location

) {

alert("Please fill all fields.");

return;

}

$scope.newJob.id = $scope.jobs.length + 101;

$scope.jobs.push(

angular.copy($scope.newJob)

);

$scope.newJob = {};

};


=
// DELETE 


$scope.deleteJob = function (id) {

var confirmDelete = confirm(

"Delete this Job?"

);

if (!confirmDelete)

return;

for (

var i = 0;

i < $scope.jobs.length;

i++

) {

if (

$scope.jobs[i].id == id

) {

$scope.jobs.splice(i, 1);

break;

}

}

};


// EDIT 


$scope.editJob = function (job) {

$scope.selectedJob = angular.copy(job);

};



// UPDATE JOB


$scope.updateJob = function () {

for (

var i = 0;

i < $scope.jobs.length;

i++

) {

if (

$scope.jobs[i].id ==

$scope.selectedJob.id

) {

$scope.jobs[i] = angular.copy(

$scope.selectedJob

);

break;

}

}

alert("Job Updated Successfully");

$scope.selectedJob = {};

};

});