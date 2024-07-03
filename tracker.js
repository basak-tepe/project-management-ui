const tracker = {
    template: `
<div>
    <!-- Button to add new tracker -->
    <button 
        type="button" class="btn btn-primary m-2 float-end"
        data-bs-toggle="modal" 
        data-bs-target="#exampleModal" 
        @click="addClick()">
        Add Tracker
    </button>

    <!-- Table to display trackers -->
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Tracker ID</th>
                <th>Title</th>
                <th>URL</th>
                <th>Type</th>
                <th>Email</th>
                <th>Token</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tracker in trackers" :key="tracker.TrackerID">
                <td>{{ tracker.TrackerID }}</td>
                <td>{{ tracker.title }}</td>
                <td><a :href="tracker.URL" target="_blank">{{ tracker.URL }}</a></td>
                <td>{{ tracker.type }}</td>
                <td>{{ tracker.email }}</td>
                <td>{{ tracker.token }}</td>
                <td>
                    <button type="button" class="btn btn-light mr-1"
                        data-bs-toggle="modal" 
                        data-bs-target="#exampleModal" 
                        @click="editClick(tracker)">
                        Edit
                    </button>
                    <button type="button" class="btn btn-light"
                        @click="deleteClick(tracker.trackerID)">
                        Delete
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Modal for adding/editing trackers -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="trackerTitle" class="form-label">Title</label>
                        <input type="text" class="form-control" id="trackerTitle" v-model="trackerTitle">
                    </div>
                    <div class="mb-3">
                        <label for="trackerURL" class="form-label">URL</label>
                        <input type="text" class="form-control" id="trackerURL" v-model="trackerURL">
                    </div>
                    <div class="mb-3">
                        <label for="trackerType" class="form-label">Type</label>
                        <select class="form-control" id="trackerType" v-model="trackerType">
                            <option value="GitHub">GitHub</option>
                            <option value="GitLab">GitLab</option>
                            <option value="Jira">Jira</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="trackerEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="trackerEmail" v-model="trackerEmail">
                    </div>
                    <div class="mb-3">
                        <label for="trackerToken" class="form-label">Token</label>
                        <input type="text" class="form-control" id="trackerToken" v-model="trackerToken">
                    </div>
                    <button type="button" class="btn btn-primary" @click="trackerId === 0 ? createTracker() : updateTracker()">
                        {{ trackerId === 0 ? 'Create' : 'Update' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
        return {
            trackers: [],
            modalTitle: '',
            trackerTitle: '',
            trackerURL: '',
            trackerType: 'GitHub', // Default value
            trackerEmail: '',
            trackerToken: '',
            trackerId: 0
        };
    },
    methods: {
        getTrackers() {
            axios.get(variables.API_URL + 'tracker/')
                .then(response => {
                    this.trackers = response.data;
                })
                .catch(error => {
                    console.error("There was an error fetching the trackers:", error);
                });
        },
        addClick() {
            this.modalTitle = 'Add Tracker';
            this.resetForm();
        },
        editClick(tracker) {
            this.modalTitle = 'Edit Tracker';
            this.trackerId = tracker.trackerID;
            this.trackerTitle = tracker.title;
            this.trackerURL = tracker.URL;
            this.trackerType = tracker.type;
            this.trackerEmail = tracker.email;
            this.trackerToken = tracker.token;
        },
        createTracker() {
            const data = {
                title: this.trackerTitle,
                URL: this.trackerURL,
                type: this.trackerType,
                email: this.trackerEmail,
                token: this.trackerToken
            };
        
            axios.post(variables.API_URL + 'tracker/', data)
                .then(response => {
                    this.getTrackers();
                    this.resetForm();
                    $('#exampleModal').modal('hide'); // Close modal
                })
                .catch(error => {
                    console.error("Error creating tracker:", error);
                });
        },        
        updateTracker() {
            const data = {
                title: this.trackerTitle,
                URL: this.trackerURL,
                type: this.trackerType,
                email: this.trackerEmail,
                token: this.trackerToken
            };

            axios.put(variables.API_URL + 'tracker/' + this.trackerId + '/', data)
                .then(response => {
                    this.getTrackers();
                    this.resetForm();
                    $('#exampleModal').modal('hide'); // Close modal
                })
                .catch(error => {
                    console.error("Error updating tracker:", error);
                });
        },
        deleteClick(trackerId) {
            console.log('Deleting tracker with ID:', trackerId);
            axios.delete(variables.API_URL + 'tracker/' + trackerId + '/')
                .then(response => {
                    this.getTrackers();
                })
                .catch(error => {
                    console.error("Error deleting tracker:", error);
                });
        },

        resetForm() {
            this.trackerTitle = '';
            this.trackerURL = '';
            this.trackerType = 'GitHub';
            this.trackerEmail = '';
            this.trackerToken = '';
            this.trackerId = 0;
        }
    },
    mounted() {
        this.getTrackers();
    }
};
