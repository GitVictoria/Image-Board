(function() {
    // everything you can do in vue instance, you can do in Vue componenet
    // Vue.component("some-component", {
    //     template: "#myTemplate",
    //
    //     props: ["firstName"], // taking parents data
    //
    //     data: function() {
    //         //data in compenent is a function that returns object.
    //         return {
    //             heading: "my first Vue component<3"
    //         };
    //     },
    //     mounted: function() {
    //         console.log("this is Vue component: ", this);
    //     },
    //     methods: {
    //         closeTheComponent: function() {
    //             this.$emit("close-component");
    //         }
    //     }
    // });

    Vue.component("image-component", {
        template: "#image",
        props: ["imageId"],
        data: function() {
            return {
                img: {
                    created_at: "",
                    description: "",
                    title: "",
                    url: "",
                    username: ""
                }
            };
        },
        mounted: function() {
            console.log("this is Vue image id", this.imageId);
            var self = this;
            axios.get("/images/" + this.imageId).then(function(response) {
                console.log("/images/" + this.imageId);
                self.img.title = response.data.rows[0].title;
                console.log("Another Vue component: ", this);
            });
        },
        methods: {
            handleClick: function() {
                console.log("handleClick is running");
            },
            closeTheComponent: function() {
                this.$emit("close-component");
                this.showComponent = false;
            }
        }
    });

    new Vue({
        //this is vue instance it has data that compenent wants
        el: "#main",
        data: {
            firstName: "Victoria Almazova",
            images: [],
            imageId: 0,
            showComponent: false,
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        mounted: function() {
            console.log("the image ID is", this.imageId);

            var self = this;
            axios.get("/images").then(function(response) {
                self.images = response.data;
            });
        }, // mounted ends here

        methods: {
            toggleComponent: function(e) {
                var self = this;
                self.imageId = e.target.id;
                console.log("this is image  ", self.imageId);
                // this.showComponent = true;
                // console.log("I am clicking ..");
            },
            //     this.imageId = idOfImageThatWasClicked;
            closeComponent() {
                this.showComponent = false;
            },
            // mounted function in the vue
            //axios function

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
                    console.log(resp.data.results[0]);
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

// main vue instance is responsiblr for when component shows
//set property in data on vue instance
// set it to true for when user clicks
