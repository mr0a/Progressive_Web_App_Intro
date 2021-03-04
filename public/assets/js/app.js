window.projectList = (function () {

    if ('serviceWorker' in navigator){
        navigator.serviceWorker.register('./service_worker.js').then(reg => {
            console.log("Successfully registered");
        }).catch(err => {
            console.log("Error while registering sw");
        })
    }

    return {
        tasks: [],
        marked: [],
        isOffline: false,
        init() {
            fetch('data.json').then(res =>{
                if (res.headers.get('sw-cache')){
                    this.isOffline = true;
                }
                return res.json();
            }).then(data => {
                this.tasks = data.tasks;
            });

            window.addEventListener('offline', e =>{
                this.isOffline = true
            });

            window.addEventListener('online', e => {
                this.isOffline = false
            });
        },
        toggleComplete(task){
            let newVal = !task.complete;
            console.log(this.marked);

            if (!this.isOffline) {
                task.complete = newVal;
            } else {
                // Checking if the task exist in marked
                let index = this.marked.indexOf(task);

                if (index > -1){
                    // Remove from marked since it exists and clicked 2nd time
                    this.marked.splice(index, 1);
                } else {
                    // Add it to marked as it doesnot exist
                    this.marked.push(task);
                }
            }
        }
    };
})();