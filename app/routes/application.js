import Ember from 'ember';
import { oqb } from '@orbit/data';

const { getOwner } = Ember;

export default Ember.Route.extend({
  beforeModel() {
    const owner = getOwner(this);
    const backup = owner.lookup('data-source:backup');
    const store = owner.lookup('service:store');

    // Warm the store's cache from backup
    return backup.pull(oqb.records())
      .then(transform => store.sync(transform))
      .then(() => {
        // Backup subsequent changes to the store
        store.on('transform', transform => backup.sync(transform));
      });
  }
});
