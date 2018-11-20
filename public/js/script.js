(function() {
    new Vue({
        el: "#main",
        data: {
            images: [],
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(response) {
                self.images = response.data;
            });
        }, // mounted ends here

        methods: {
            // every function that runs in rsponse to an event
            uploadFile: function(e) {
                var self = this;
                e.preventDefault();
                // use formData to upload file to server
                var formData = new FormData();
                formData.append("file", this.form.file); // takes two arguments 1. key 2. value
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(resp) {
                    self.images.unshift(resp.data.results[0]);
                    console.log("resp:", resp);
                });
            },
            handleFileChnage: function(e) {
                this.form.file = e.target.files[0];
            }
        } // end of methods
    });
})();
