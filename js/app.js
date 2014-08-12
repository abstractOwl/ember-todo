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
    return _.values(this.items);
  },
  delete: function (id) {
    delete this.items[id];
    window.localStorage.setItem('tasks', JSON.stringify(this.items));
  },
  find: function (id) {
    console.log('find ' + id + ": " + JSON.stringify(this.items[id]));
    return this.items[id];
  },
  create: function (name, desc) {
    this.items[this.counter] = { name: name, desc: desc, id: this.counter };
    this.counter++;
    window.localStorage.setItem('counter', this.counter);
    window.localStorage.setItem('tasks', JSON.stringify(this.items));
  },
  update: function (id, name, desc) {
    this.items[id] = { name: name, desc: desc, id: id };
    console.log('update ' + id + ": " + JSON.stringify(this.items[id]));
    window.localStorage.setItem('tasks', JSON.stringify(this.items));
  }
};
Tasks.init();


app.Router.map(function () {
  this.resource('task', { path: "tasks/:id" }, function () {
    this.route('index');
    this.route('edit');
  });
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

app.TaskController = Ember.ObjectController.extend({
  actions: {
    editTask: function () {
      var id = this.get('model').id;
      this.transitionToRoute('/tasks/' + id + '/edit');
    },
    deleteTask: function () {
      Tasks.delete(this.get('model').id);
      this.transitionToRoute('index');
    },
    goBack: function () {
      this.transitionToRoute('index');
    }
  }
});
app.TaskRoute = Ember.Route.extend({
  model: function (task) {
    return Ember.RSVP.Promise.resolve(Tasks.find(task.id));
  }
});

app.TaskEditController = app.TaskController.extend({
  actions: {
    goBack: function () {
      this.transitionToRoute('task.index');
    },
    updateTask: function () {
      Tasks.update(this.get('model').id, this.get('newName'), this.get('newDesc'));
      this.set('name', this.get('newName'));
      this.set('desc', this.get('newDesc'));
      this.transitionToRoute('task', this.get('model'));
    }
  },
  needs: ['task'],
  newName: Ember.computed.oneWay('controllers.task.name'),
  newDesc: Ember.computed.oneWay('controllers.task.desc'),
  task: Ember.computed.alias('controllers.task')
});
app.TaskEditRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('task');
  }
});

app.TaskIndexRoute = Ember.Route.extend({
  model: function () {
    var task = this.modelFor('task')
    return Ember.RSVP.Promise.resolve(Tasks.find(task.id));
  }
});
app.TaskIndexController = app.TaskController.extend({
  needs: ['task'],
  name: Ember.computed.alias('controllers.task.name'),
  desc: Ember.computed.alias('controllers.task.desc')
});
