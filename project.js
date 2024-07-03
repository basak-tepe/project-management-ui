const project = {
    template: `
<div>
    <!-- Button to add new project -->
    <button 
        type="button" class="btn btn-primary m-2 float-end"
        data-bs-toggle="modal" 
        data-bs-target="#exampleModal" 
        @click="addClick()">
        Add Project
    </button>

    <!-- Table to display projects -->
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Project Slug</th>
                <th>Project Description</th>
                <th>Project Language</th>
                <th>Project Repositories</th>
                <th>Project Trackers</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="project in projects" :key="project.projectID">
                <td>{{ project.projectID }}</td>
                <td>{{ project.name }}</td>
                <td>{{ project.slug }}</td>
                <td>{{ project.description }}</td>
                <td>{{ project.language }}</td>
                <td>
                    <ul>
                        <li v-for="repo in project.repositories" :key="repo.repositoryID">
                            <a :href="repo.URL" target="_blank">{{ repo.title }}</a>
                        </li>
                    </ul>
                </td>

                <td>
                    <ul>
                        <li v-for="tracker in project.trackers" :key="tracker.trackerID">
                            <a :href="tracker.URL" target="_blank">{{ tracker.title }}</a>
                        </li>
                    </ul>
                </td>
                <td>
                    <button type="button" class="btn btn-light mr-1"
                        data-bs-toggle="modal" 
                        data-bs-target="#exampleModal" 
                        @click="editClick(project)">
                        Edit
                    </button>
                    <button type="button" class="btn btn-light"
                        @click="deleteClick(project.projectID)">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Modal for adding/editing projects -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="projectName" class="form-label">Project Name</label>
                        <input type="text" class="form-control" id="projectName" v-model="projectName">
                    </div>
                    <div class="mb-3">
                        <label for="projectSlug" class="form-label">Project Slug</label>
                        <input type="text" class="form-control" id="projectSlug" v-model="projectSlug">
                    </div>
                    <div class="mb-3">
                        <label for="projectDescription" class="form-label">Project Description</label>
                        <textarea class="form-control" id="projectDescription" v-model="projectDescription"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="projectLanguage" class="form-label">Project Language</label>
                        <input type="text" class="form-control" id="projectLanguage" v-model="projectLanguage">
                    </div>
                    <div class="mb-3">
                        <label for="projectRepositories" class="form-label">Project Repositories</label>
                        <select class="form-select" id="projectRepositories" multiple v-model="selectedRepositories">
                            <option v-for="repo in repositories" :key="repo.repositoryID" :value="repo.repositoryID">{{ repo.title }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="projectTrackers" class="form-label">Project Trackers</label>
                        <select class="form-select" id="projectTrackers" multiple v-model="selectedTrackers">
                            <option v-for="tracker in trackers" :key="tracker.trackerID" :value="tracker.trackerID">{{ tracker.title }}</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary" @click="projectId === 0 ? createProject() : updateProject()">
                        {{ projectId === 0 ? 'Create' : 'Update' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            projects: [],
            repositories: [],
            trackers: [],
            modalTitle: '',
            projectName: '',
            projectSlug: '',
            projectDescription: '',
            projectLanguage: '',
            selectedRepositories: [],
            selectedTrackers: [],
            projectId: 0
        };
    },
    methods: {
        getProjects() {
            axios.get(variables.API_URL + 'project')
                .then(response => {
                    this.projects = response.data;
                })
                .catch(error => {
                    console.error("There was an error fetching the projects:", error);
                });
        },
        getRepositories() {
            axios.get(variables.API_URL + 'repository')
                .then(response => {
                    this.repositories = response.data;
                })
                .catch(error => {
                    console.error("There was an error fetching the repositories:", error);
                });
        },
        
        getTrackers() {
            axios.get(variables.API_URL + 'tracker')
                .then(response => {
                    this.trackers = response.data;
                })
                .catch(error => {
                    console.error("There was an error fetching the trackers:", error);
                });
        },        
        addClick() {
            this.modalTitle = 'Add Project';
            this.resetForm();
        },
        editClick(project) {
            this.modalTitle = 'Edit Project';
            this.projectId = project.projectID;
            this.projectName = project.name;
            this.projectSlug = project.slug;
            this.projectDescription = project.description;
            this.projectLanguage = project.language;
            this.selectedRepositories = project.repositories.map(repo => repo.repositoryID);
            this.selectedTrackers = project.trackers.map(tracker => tracker.trackerID);
        },
        createProject() {
            // Prepare data to send to the backend
            const data = {
                name: this.projectName,
                slug: this.projectSlug,
                description: this.projectDescription,
                language: this.projectLanguage,
                repositories: this.selectedRepositories,
                trackers: this.selectedTrackers
            };

            // Send POST request to create new project
            axios.post(variables.API_URL + 'project/', data)
                .then(response => {
                    // Handle success, refresh projects list
                    this.getProjects();
                    this.resetForm();
                    $('#exampleModal').modal('hide'); // Close modal
                })
                .catch(error => {
                    console.error("Error creating project:", error);
                });
        },
        updateProject() {
            // Prepare data to send to the backend
            const data = {
                name: this.projectName,
                slug: this.projectSlug,
                description: this.projectDescription,
                language: this.projectLanguage,
                repositories: this.selectedRepositories,
                trackers: this.selectedTrackers
            };

            // Send PUT request to update project
            axios.put(variables.API_URL + 'project/' + this.projectId + '/', data)
                .then(response => {
                    // Handle success, refresh projects list
                    this.getProjects();
                    this.resetForm();
                    $('#exampleModal').modal('hide'); // Close modal
                })
                .catch(error => {
                    console.error("Error updating project:", error);
                });
        },
        deleteClick(projectId) {
            // Send DELETE request to delete project
            axios.delete(variables.API_URL + 'project/' + projectId + '/')
                .then(response => {
                    // Handle success, refresh projects list
                    this.getProjects();
                })
                .catch(error => {
                    console.error("Error deleting project:", error);
                });
        },
        resetForm() {
            // Reset form fields and selected values
            this.projectName = '';
            this.projectSlug = '';
            this.projectDescription = '';
            this.projectLanguage = '';
            this.selectedRepositories = [];
            this.selectedTrackers = [];
            this.projectId = 0;
        }
    },
    mounted() {
        this.getProjects();
        this.getRepositories();
        this.getTrackers();
    }
};
