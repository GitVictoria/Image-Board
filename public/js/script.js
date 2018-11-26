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
                    imageId: "",
                    title: "",
                    lastId: "",
                    url: "",
                    username: ""
                },
                form1: {
                    comment: "",
                    name: ""
                },
                comment: []
            };
        },
        watch: {
            imageId: function() {
                console.log("watcher running!", this.imageId);
            }
        },
        mounted: function() {
            var self = this;
            //
            // axios.get("/comments").then(function(response) {
            //     console.log("AXIOS GET for comments is running");
            //     (self.comment.name = response.data.rows[0].name),
            //     (self.comment.comment = response.data.rows[0].comment),
            //     (self.comment.published_at =
            //             response.data.rows[0].published_at);
            // });

            axios.get("/images/" + self.imageId).then(function(response) {
                console.log("response.data: ", response.data);

                self.img.created_at = response.data[0].rows[0].created_at;
                self.img.description = response.data[0].rows[0].description;
                self.img.description = response.data[0].rows[0].id;
                self.img.title = response.data[0].rows[0].title;
                self.img.lastId = response.data[0].rows[0].last_id;
                self.img.url = response.data[0].rows[0].url;
                self.img.username = response.data[0].rows[0].username;
                self.comment = response.data[1].rows;
            });
        },
        methods: {
            submitComment: function(e) {
                var self = this;
                e.preventDefault();
                // this.$emit("submit-comment");
                // var commentsObj = {
                //     name: this.form1.name,
                //     comment: this.form1.comment
                // };

                // put the coment into database
                axios
                    .post("/comments", {
                        username: this.form1.name,
                        comment: this.form1.comment,
                        image_id: this.imageId // this id we already have form PROPS
                    })
                    .then(function(resp) {
                        self.comment.unshift(resp.data.rows[0]);
                    });
            },

            handleClick: function() {
                console.log("handleClick is running");
            },
            closeTheComponent: function() {
                this.$emit("close-component");
                // this.showComponent = true; DOES NOT SET IT. WHY?
            },
            del: function() {
                this.$emit("del");
            }
        }
    });

    new Vue({
        //this is vue instance it has data that compenent wants
        el: "#main",
        data: {
            firstName: "Victoria Almazova",
            images: [],
            imageId: location.hash.slice(1) || 0,
            showComponent: false,
            showMore: true,
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },
        mounted: function() {
            var self = this;

            window.addEventListener("hashchange", function() {
                console.log("hash has changed", location.hash.slice(1));
                self.imageId = location.hash.slice(1);
            });

            axios.get("/images").then(function(response) {
                self.images = response.data;
            });
        }, // mounted ends here

        methods: {
            toggleComponent: function(e) {
                var self = this;
                self.imageId = e.target.id;
                console.log("this is image id ", self.imageId);
                // get image and comments and pass it to VUE
            },

            getMoreImages: function() {
                var self = this;
                var lastId = this.images[this.images.length - 1].id;

                // GET /get-more-images/44
                axios.get("/get-more-images/" + lastId).then(function(resp) {
                    self.images.push.apply(self.images, resp.data);
                    console.log("resp in /get-more-images: ", resp);
                    if (resp.data.length == 0) {
                        self.showMore = false;
                        console.log(self);
                    }
                });
            },

            //     this.imageId = idOfImageThatWasClicked;
            closeComponent() {
                this.imageId = null;
            },

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
            },
            del: function() {
                var self = this;
                axios.post("/del/" + this.imageId).then(function(resp) {
                    if (resp) {
                        self.images = self.images.filter(function(img) {
                            return img.id != self.imageId; // creating a new array where I push out an object where id doesn't pass the test
                        });

                        console.log("DELETE REQ RECEIVED A RESP");
                        self.imageId = null;
                    }
                });
            }
        } // end of methods
    });
})();

// main vue instance is responsible for when component shows
// set property in data on vue instance
// set it to true for when user clicks

/// MORE button
// IF you click on more button and there are no more images
// button goes away in axios if resp.data is empty => GO AWAY BUTTON

// Check what is the last ID in the array that I just got last image in the array HAS ID 1
// if the last image in the array ID = 1 then BUTTON GO AWAY

// figure out what is the last ID in the database
// gould be another query
// do a sub quey (a query within a query )
// in the get More Image

//take the id of the image we click on
// put that id into the url
// the id of the image appears in the url
// sharing the url
// if the user puts in something in the url that doesnt correspond to an id of an image in database
// we don't want to do anything
// we have to listen for when the imageId in the componenet has chaged
// if the ID has changed then we have to re-run mounted function

// exactly same process as in the mounted fucntion passed to VUE
// so when i change the ur with a new ID the new image shows up
//
// BONUS
// sub query that gives id of the next image
// (SELECT id FROM images WHERE id > $1 LIMIT 1) AS next_id,
// (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1) AS prev_id

// 3. mounted function of Vue instance
// write setInterval(function{ I check for new images }, 3000) function
// 4 . when i detect on server site check input user provided
// was that input  afile or url?
// if the user gave us url we need to do http request to save the image
// npm module "require"
// 6. figure how to delte images from amazon
