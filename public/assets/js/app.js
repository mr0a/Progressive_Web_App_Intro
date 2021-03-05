window.projectList = (function () {

    if ('serviceWorker' in navigator){
        navigator.serviceWorker.register('./service_worker.js').then(reg => {
            console.log("Successfully registered");
        }).catch(err => {
            console.log("Error while registering sw");
        })
    }

    function getDbValue() {
        return idbKeyval.get('changed').then(val => val || []);
    }

    function setDbValue(val) {
        return idbKeyval.set('changed', val);
    }

    function addToDb(id, complete){
        return getDbValue().then(val => {
            console.log(val);
            val.push({id, complete});
            return setDbValue(val);
        })
    }

    function removeFromDb(id){
        return getDbValue().then(val => {
            let index = val.findIndex(obj => obj.id == id);

            if (index > -1){
                val.splice(index, 1);
            }

            return setDbValue(val);
        });
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

            if (!this.isOffline) {
                task.complete = newVal;
            } else {
                // Checking if the task exist in marked
                let index = this.marked.indexOf(task);

                if (index > -1){
                    // User changes doesnot want to update this task
                    removeFromDb(task.id).then(() => this.marked.splice(index, 1));
                    // this.marked.splice(index, 1);
                } else {
                    // Add it to marked as it doesnot exist
                    addToDb(task.id, newVal).then(() => this.marked.push(task));
                    // this.marked.push(task);
                }
            }
        }
    };
})();