var app = Ember.Application.create({
  rootElement: "#todo-app"
});

// Temporary basic data store
var Tasks = app.Tasks = {
  init: function () {
    this.counter = parseInt(window.localStorage.getItem('counter') || '0', 10);
    this.items = JSON.parse(window.localStorage.getItem('tasks') || '{}');
  },
  all: function () {
    console.log(_.values(this.items));
    return _.values(this.items);
  },
  find: function (id) {
    return this.items[id];
  },
  create: function (name, desc) {
    this.items[this.counter] = { name: name, desc: desc, id: this.counter };
    this.counter++;
    window.localStorage.setItem('counter', this.counter);
    window.localStorage.setItem('tasks', JSON.stringify(this.items));
  }
};
Tasks.init();


app.Router.map(function () {
  this.resource('task', { path: "tasks/:id" });
  this.route('newTask', { path: "tasks/new"});
});

app.IndexController = Ember.ArrayController.extend({
  actions: {
    newTask: function () {
      this.transitionToRoute('newTask');
    }
  }
});
app.IndexRoute = Ember.Route.extend({
  model: function () {
    return Ember.RSVP.Promise.resolve(Tasks.all());
  }
});

app.NewTaskController = Ember.ArrayController.extend({
  actions: {
    createTask: function () {
      // TODO validation
      Tasks.create(this.get('name'), this.get('desc'));
      Ember.$('#task-name, #task-desc').val('');
      this.transitionToRoute('index');
    }
  }
});

app.TaskRoute = Ember.Route.extend({
  model: function (task) {
    return Tasks.find(task.id);
  }
});

