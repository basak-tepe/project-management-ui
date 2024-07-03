const repository = {
    template: `
<div>
    <!-- Button to add new repository -->
    <button 
        type="button" class="btn btn-primary m-2 float-end"
        data-bs-toggle="modal" 
        data-bs-target="#exampleModal" 
        @click="addClick()">
        Add Repository
    </button>

    <!-- Table to display repositories -->
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Repository ID</th>
                <th>Title</th>
                <th>URL</th>
                <th>Type</th>
                <th>Email</th>
                <th>Token</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="repo in repositories" :key="repo.repositoryID">
                <td>{{ repo.repositoryID }}</td>
                <td>{{ repo.title }}</td>
                <td><a :href="repo.URL" target="_blank">{{ repo.URL }}</a></td>
                <td>{{ repo.type }}</td>
                <td>{{ repo.email }}</td>
                <td>{{ repo.token }}</td>
                <td>
                    <button type="button" class="btn btn-light mr-1"
                        data-bs-toggle="modal" 
                        data-bs-target="#exampleModal" 
                        @click="editClick(repo)">
                        Edit
                    </button>
                    <button type="button" class="btn btn-light"
                        @click="deleteClick(repo.repositoryID)">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Modal for adding/editing repositories -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="repoTitle" class="form-label">Title</label>
                        <input type="text" class="form-control" id="repoTitle" v-model="repoTitle">
                    </div>
                    <div class="mb-3">
                        <label for="repoURL" class="form-label">URL</label>
                        <input type="text" class="form-control" id="repoURL" v-model="repoURL">
                    </div>
                    <div class="mb-3">
                        <label for="repoType" class="form-label">Type</label>
                        <select class="form-control" id="repoType" v-model="repoType">
                            <option value="GitHub">GitHub</option>
                            <option value="GitLab">GitLab</option>
                            <option value="Bitbucket">Bitbucket</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="repoEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="repoEmail" v-model="repoEmail">
                    </div>
                    <div class="mb-3">
                        <label for="repoToken" class="form-label">Token</label>
                        <input type="text" class="form-control" id="repoToken" v-model="repoToken">
                    </div>
                    <button type="button" class="btn btn-primary" @click="repoId === 0 ? createRepository() : updateRepository()">
                        {{ repoId === 0 ? 'Create' : 'Update' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            repositories: [],
            modalTitle: '',
            repoTitle: '',
            repoURL: '',
            repoType: 'GitHub', // Default value
            repoEmail: '',
            repoToken: '',
            repoId: 0
        };
    },
    methods: {
        getRepositories() {
            axios.get(variables.API_URL + 'repository')
                .then(response => {
                    this.repositories = response.data;
                })
                .catch(error => {
                    console.error("There was an error fetching the repositories:", error);
                });
        },
        addClick() {
            this.modalTitle = 'Add Repository';
            this.resetForm();
        },
        editClick(repo) {
            this.modalTitle = 'Edit Repository';
            this.repoId = repo.repositoryID;
            this.repoTitle = repo.title;
            this.repoURL = repo.URL;
            this.repoType = repo.type;
            this.repoEmail = repo.email;
            this.repoToken = repo.token;
        },
        createRepository() {
            const data = {
                title: this.repoTitle,
                URL: this.repoURL,
                type: this.repoType,
                email: this.repoEmail,
                token: this.repoToken
            };
        
            axios.post(variables.API_URL + 'repository/', data)
                .then(response => {
                    this.getRepositories();
                    this.resetForm();
                    $('#exampleModal').modal('hide'); // Close modal
                })
                .catch(error => {
                    console.error("Error creating repository:", error);
                });
        },        
        updateRepository() {
            // Prepare data to send to the backend
            const data = {
                title: this.repoTitle,
                URL: this.repoURL,
                type: this.repoType,
                email: this.repoEmail,
                token: this.repoToken
            };

            // Send PUT request to update repository
            axios.put(variables.API_URL + 'repository/' + this.repoId + '/', data)
                .then(response => {
                    // Handle success, refresh repositories list
                    this.getRepositories();
                    this.resetForm();
                    $('#exampleModal').modal('hide'); // Close modal
                })
                .catch(error => {
                    console.error("Error updating repository:", error);
                });
        },
        deleteClick(repoId) {
            // Send DELETE request to delete repository
            axios.delete(variables.API_URL + 'repository/' + repoId + '/')
                .then(response => {
                    // Handle success, refresh repositories list
                    this.getRepositories();
                })
                .catch(error => {
                    console.error("Error deleting repository:", error);
                });
        },
        resetForm() {
            // Reset form fields
            this.repoTitle = '';
            this.repoURL = '';
            this.repoType = 'GitHub'; // Reset to default
            this.repoEmail = '';
            this.repoToken = '';
            this.repoId = 0;
        }
    },
    mounted() {
        this.getRepositories();
    }
};
