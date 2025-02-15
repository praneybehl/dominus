Meteor.methods({
	buy_resource: function(type, quantity) {
		var start_time = new Date()
		check(type, String)
		check(quantity, Number)

		if (!isFinite(quantity)) {
			throw new Meteor.Error(404, "buy_resource quantity !isFinite");
		}

		if (quantity <= 0) {
			return {result: false, reason: 'Enter quantity above 0'}
		}

		var resource = Market.findOne({type: type}, {fields: {_id:1}})
		if (resource) {
			var fields = {}
			fields['gold'] = 1
			fields[type] = 1
			var user = Meteor.users.findOne(Meteor.userId(), {fields: fields})

			var cost = total_of_buy(type, quantity)
			if (isNaN(cost) || !isFinite(cost)) {
				return {result: false, reason: 'Error'}
			}

			if (user.gold >= cost) {

				var fields = {}
				fields['gold'] = cost * -1
				fields[type] = quantity
				Meteor.users.update(user._id, {$inc: fields})

				if (!this.isSimulation) {
					update_market_price(type, quantity, true)
					//worker.enqueue('update_market_price', {type: type, quantity: quantity, buy: true})

					worker.enqueue('record_market_history', {quantity: quantity})
					//record_market_history(quantity)
				}
				check(cost, Number)
				return {result: true, cost: cost}

			} else {
				return {result: false, reason: 'Not enough gold.'}
			}
		}
		return {result: false, reason: 'Error'}
	},


	sell_resource: function(type, quantity) {
		check(type, String)
		check(quantity, Number)

		if (!isFinite(quantity)) {
			throw new Meteor.Error(404, "sell_resource quantity !isFinite");
		}

		if (quantity <= 0) {
			return {result: false, reason: 'Enter quantity above 0'}
		}

		var resource = Market.findOne({type: type}, {fields: {_id:1}})
		if (resource) {
			var fields = {}
			fields['gold'] = 1
			fields[type] = 1
			var user = Meteor.users.findOne(Meteor.userId(), {fields: fields})
			
			// does user have enough
			if (user[type] < quantity) {
				return {result: false, reason: 'Not enough resources.'}
			}

			var total = total_of_sell(type, quantity)

			if (isNaN(total) || !isFinite(total)) {
				return {result: false, reason: 'Error'}
			}

			var fields = {}
			fields['gold'] = total
			fields[type] = quantity * -1
			Meteor.users.update(user._id, {$inc: fields})

			if (!this.isSimulation) {
				update_market_price(type, quantity, false)
				//worker.enqueue('update_market_price', {type: type, quantity: quantity, buy: false})

				//record_market_history(quantity)
				worker.enqueue('record_market_history', {quantity: quantity})
			}

			return {result: true, total: total}
		}
		return {result: false, reason: 'Error'}
	},

})