Vue.component('Kanban', {
    template: `
<div class="Kanban">
<div style="display: flex; justify-content: space-around">


    <form class="col_wid forms" @submit.prevent="createTask">
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
        <p>
        <label for="name">name:</label>
        <input id="name" v-model="name" placeholder="Name for task">
        </p>
        <p>
          <label for="desc">Description:</label>
          <input id="desc" v-model="desc" placeholder="Description for task" type="text">
        </p>

        <p>
          <label for="dline">Deadline:</label>
          <input id="dline" v-model="deadline" type="date">
        </p>

          <div v-if="((name !=null) && (name !=''))">
              <p>
                  <input type="submit" value="Submit">
              </p>
      </div>



      </form>


<div class="col_wid">

    <h1>Запланированные задачи</h1>
    <div v-for="(task_item, itemId) in kanTasks" :key="itemId"  >

     
              <div v-if="task_item.column==1" class="Task">
              <p>Задача: {{task_item.name}}</p>
              <p>Время создания {{task_item.createdAt}}</p>
              <p>Дедлайн {{task_item.deadline_date}} </p>
              <p v-if="task_item.time_stamp!=null" >Редатирование:{{task_item.time_stamp}} </p>
              <p>Описание: {{task_item.description}}</p>

                <button @click="DelTask(task_item)" type="submit">Удалить</button>
              
              </div>
            </div>
    

</div>

    <div class="col_wid">
        <h1>В работе</h1>
    </div>
      <div class="col_wid">

          <h1>Тестирование</h1>
      </div>


    <div class="col_wid">
        <h1>Завершено</h1>
    </div>

  </div>

</div>
`,
    data() {
        return {
            done_blocker: false,
            add_blocker: false,
            kanTasks:[],

            name: null,
            desc: null,
            deadline: null,
            time_stamp: null,

            errors: []
        }

    },
    methods: {
        toNextColumn(task) {
            task.column++
            if (task.column===4){
                task.end_stamp=task.deadline-Date.now()
            }
        },
        toTestColumn(task) {
            if (this.testDesc){
                task.column--
                task.testDesc=this.testDesc
                this.testDesc=null
                task.time_stamp= "Время "+ new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()+
                    ' Дата '+new Date(Date.now()).getDate()+":"
                    +(new Date(Date.now()).getMonth()+1)+":"
                    +new Date(Date.now()).getFullYear();
            }
            else{
                if (!this.name) this.errors.push("Test Description is required")
            }

        },
        DelTask(task) {
            console.log(1)
            index=this.kanTasks.findIndex((element) => element === task)
            console.log(this.kanTasks[index].column)
            if (this.kanTasks[index].column===1){
                this.kanTasks.splice(index,1)
            }
        },
        createTask(){
            if (this.name && this.desc && this.deadline){
                let task = {
                    column: 1,
                    name: this.name,
                    description: this.desc,
                    deadline: new Date(this.deadline),

                    testDesc:null,

                    time_stamp: null,
                    end_stamp: null,

                    deadline_date: new Date(this.deadline),

                    createdAt: "Время "+ new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()+
                        ' Дата '+new Date(Date.now()).getDate()+":"
                        +(new Date(Date.now()).getMonth()+1)+":"
                        +new Date(Date.now()).getFullYear(),
                }
                this.name = null
                this.desc = null
                this.deadline = null
                this.kanTasks.push(task)
                this.errors.clear()
            }
            else{
                if (!this.name) this.errors.push("name required.")
                if (!this.desc) this.errors.push("description required.")
                if (!this.deadline) this.errors.push("deadline required.")
            }
        },

        redact(task){
            if (this.name){
                task.name=this.name
                this,name=null
            }
            else if( this.desc){
                task.description=this.desc
                this.desc=null
            }
            else {
                return
            }

            task.time_stamp=  "Время "+ new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()+
                ' Дата '+new Date(Date.now()).getDate()+":"
                +(new Date(Date.now()).getMonth()+1)+":"
                +new Date(Date.now()).getFullYear()
        },
    },
    created(){
        const savedTasks=JSON.parse(localStorage.getItem('kanTasks'))
        if (savedTasks){
            this.kanTasks=savedTasks;

        }
    },
    updated(){
        localStorage.setItem('kanTasks', JSON.stringify(this.kanTasks))

    },

})


let app = new Vue({
    el: '#app',



}
)
