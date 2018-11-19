(function() {
    new Vue({
        el: "#main",
        data: {
            images: []
        },
        mounted: function() {
            var self = this;
            console.log(self);
            axios.get("/images").then(function(response) {
                console.log("response: ", response.data.rows);

                self.images = response.data.rows;
            });
        }
    });
})();
