window.todoStore = {
	todos: JSON.parse(localStorage.getItem('todo-store') || '[]'),

	save() {
		localStorage.setItem('todo-store', JSON.stringify(this.todos));
	}
}


window.todos = function () {
	return {
		newTodo: '',
		...todoStore,
		editingTodo: null,
		filter: 'all',

		get activeTodo() {
			return this.todos.filter(todo => !todo.completed);
		},

		get completedTodo() {
			return this.todos.filter(todo => todo.completed);
		},

		get allComplete() {
			return this.todos.length === this.completedTodo.length;
		},

		filterTodos() {
			return {
				all: this.todos,
				active: this.activeTodo,
				completed: this.completedTodo
			}[this.filter];
		},

		addTodo() {
			if (! this.newTodo) {
				return;
			}

			this.todos.push({
				id: Date.now(),
				body: this.newTodo,
				completed: false
			});

			this.save();

			this.newTodo = ''
		},

		editTodo(todo) {
			todo.cachedBody = todo.body;

			this.editingTodo = todo;
		},

		editComplete(todo) {
			if (todo.body.trim() === '') {
				return this.deleteTodo(todo);
			}

			this.editingTodo = null;

			this.save();
		},

		cancelEdit(todo) {
			todo.body = todo.cachedBody;

			this.editingTodo = null;

			delete todo.cachedBody;
		},

		deleteTodo(id) {
			let position = this.todos.indexOf(id);
			this.todos.splice(position, 1);
			this.save();
		},

		todoClearCompleted() {
			this.todos = this.activeTodo;

			this.save();
		},

		toggleTodoCompletion(todo) {
			todo.completed = ! todo.completed

			this.save();
		},

		toggleAllComplete() {
			let allComplete = this.allComplete;

			this.todos.forEach(todo => todo.completed = ! allComplete);

			this.save();
		},
	};
}
