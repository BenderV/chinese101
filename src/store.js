import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import words from './assets/words.json';

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'my-app',
  storage: window.localStorage
})


export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    words: words,
    scores: {},
  },
  mutations: {
    updateScore(state, {index, score}) {
      // mutate state
      let new_score = score
      if (index in state.scores) {
        new_score = new_score + state.scores[index];
      }
      Vue.set(state.scores, index, new_score)
    }
  },
  actions: {

  }
})
