Router.map(function() {
	
	this.route('index', {
		path: '/',
		action: function() {
			if (Meteor.userId()) {
				this.render('game')
			} else {
				this.render('landing')
			}
		}
	})

	// not used
	//this.route('game', {path: '/'})

	this.route('admin')

	this.route('adminForums', {
		path: '/admin/forums',
		waitOn: function() { return Meteor.subscribe('admin_forums') }
	})

	this.route('adminCharges', {
		path: '/admin/charges',
		waitOn: function() { return Meteor.subscribe('admin_charges') }
	})

	this.route('adminFacts', {
		path: '/admin/facts'
	})

	this.route('adminGamestats', {
		path: '/admin/gamestats',
		waitOn: function() { return Meteor.subscribe('admin_gamestats') }
	})

	this.route('adminJobstats', {
		path: '/admin/jobstats',
		waitOn: function() { return Meteor.subscribe('admin_jobstats') }
	})

	this.route('adminMailchimpList', {
		path: '/admin/admin_mailchimp_list',
		waitOn: function() { return Meteor.subscribe('admin_mailchimp_list') }
	})

	this.route('adminUsersOnline', {
		path: '/admin/admin_users_online',
		waitOn: function() { return Meteor.subscribe('admin_users_online') }
	})

	this.route('adminJobqueue', {
		path: '/admin/admin_jobqueue',
		waitOn: function() { return Meteor.subscribe('admin_jobqueue')}
	})

	this.route('adminCommands', {
		path: '/admin/admin_commands',
	})

	this.route('presskit', {
		path: '/presskit'
	})

});