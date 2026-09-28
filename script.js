let applications =
    JSON.parse(localStorage.getItem("applications")) || [];

const form = document.getElementById("applicationForm");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");

const searchInput = document.getElementById("search");
const filterInput = document.getElementById("filter");

const applicationList =
    document.getElementById("applicationList");


/* Add Application */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const application = {

        id: Date.now(),

        company: companyInput.value,

        role: roleInput.value,

        date: dateInput.value,

        status: statusInput.value

    };

    applications.push(application);

    saveApplications();

    form.reset();

    displayApplications();

});


/* Save to LocalStorage */

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}


/* Display Applications */

function displayApplications() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedFilter =
        filterInput.value;


    const filteredApplications =
        applications.filter(function (application) {

            const matchesSearch =
                application.company
                    .toLowerCase()
                    .includes(searchText)

                ||

                application.role
                    .toLowerCase()
                    .includes(searchText);


            const matchesFilter =
                selectedFilter === "All"
                ||
                application.status === selectedFilter;


            return matchesSearch && matchesFilter;

        });


    applicationList.innerHTML = "";


    if (filteredApplications.length === 0) {

        applicationList.innerHTML =
            "<p>No applications found.</p>";

        updateStatistics();

        return;
    }


    filteredApplications.forEach(function (application) {

        const div =
            document.createElement("div");

        div.className = "application";


        div.innerHTML = `

            <div class="application-info">

                <h3>
                    ${application.role}
                </h3>

                <p>
                    ${application.company}
                </p>

                <p>
                    Applied on: ${application.date}
                </p>

                <p class="status">
                    Status: ${application.status}
                </p>

            </div>


            <div class="actions">

                <button
                    onclick="editApplication(${application.id})">
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteApplication(${application.id})">
                    Delete
                </button>

            </div>

        `;


        applicationList.appendChild(div);

    });


    updateStatistics();

}


/* Delete */

function deleteApplication(id) {

    applications =
        applications.filter(function (application) {

            return application.id !== id;

        });


    saveApplications();

    displayApplications();

}


/* Edit */

function editApplication(id) {

    const application =
        applications.find(function (application) {

            return application.id === id;

        });


    if (!application) return;


    companyInput.value =
        application.company;

    roleInput.value =
        application.role;

    dateInput.value =
        application.date;

    statusInput.value =
        application.status;


    deleteApplication(id);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* Search */

searchInput.addEventListener(
    "input",
    displayApplications
);


/* Filter */

filterInput.addEventListener(
    "change",
    displayApplications
);


/* Statistics */

function updateStatistics() {

    document.getElementById("totalCount")
        .textContent = applications.length;


    document.getElementById("appliedCount")
        .textContent =
        applications.filter(
            app => app.status === "Applied"
        ).length;


    document.getElementById("interviewCount")
        .textContent =
        applications.filter(
            app => app.status === "Interview"
        ).length;


    document.getElementById("selectedCount")
        .textContent =
        applications.filter(
            app => app.status === "Selected"
        ).length;


    document.getElementById("rejectedCount")
        .textContent =
        applications.filter(
            app => app.status === "Rejected"
        ).length;

}


/* Initial Load */

displayApplications();