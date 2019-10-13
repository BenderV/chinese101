<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="6" md="4">
            <h1>Chinese 101</h1>
            <v-select
              @change="selectCategory()"
              v-model="category"
              :items="inputCategories"
              item-text="name"
              item-value="value"
            />
            <Asker
              v-bind:key="word.id"
              v-show="word==selectedWord"
              :word="word" :next="next"
              v-for="word in selectedWords" 
            />
            <br/><hr/><br/>
            <h2>Cheatsheet</h2>
            <v-switch v-model="cheatsheet_display"></v-switch>

            <div 
                v-bind:key="category"
                v-for="(words, category) in wordsByCategories"
                v-show="cheatsheet_display"
              >
              <h3>{{category}}</h3>
              <ul v-bind:key="word.id" v-for="word in words">
                <li v-bind:style="{'background-color': getColor(calculColorGradient(word.score))}">{{word.chinese}} ({{word.pinyin}}): {{word.english}} <small v-if="word.score">(score: {{word.score}})</small>
                </li>
              </ul>
              <br/>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </v-app>
</template>

<script>
import _ from 'lodash';
import Asker from './components/Asker';

export default {
  name: 'App',
  components: {
    Asker,
  },
  data: () => ({
    selectedWord: null,
    category: null,
    cheatsheet_display: false,
  }),
  mounted() {
    this.selectNextWord()
  },
  methods: {
    selectNextWord: function() {
      for (var i = 10; i >= 0; i--) { // try 10 times
        let word = _.sample(this.selectedWords)
        if (word != this.selectedWord) {
          this.selectedWord = word;
        }
      }
    },
    getColor: function(value) {
      //value from 0 to 1
      var hue=((1-value)*120).toString(10);
      return ["hsl(",hue,",100%,50%)"].join("");
    },
    calculColorGradient: function(score) {
      if (score >= 5) {
        return 0
      }
      else if (score <= -5) {
        return 1
      } else {
        return 0.5 - (score / 10)
      }
    },
    selectCategory: function() {
      this.selectNextWord();
    },
    next: function(score) {
      this.$store.commit('updateScore', {
        index: this.selectedWord.id,
        score: score
      });
      this.selectNextWord()
    }
  },
  computed: {
    selectedWords: function() {
      // words.forEach
      let selectedWords = [];
      let category = this.category;
      let scores = this.$store.state.scores;
      this.$store.state.words.forEach(function(word) {
        if (category == null || word.category == category) {
          if (word.id in scores) {
            word.score = scores[word.id]
          }
          selectedWords.push(word)
        }
      });
      return selectedWords;
    },
    inputCategories: function() {
      let selections = [{
        'value': null,
        'name': 'All',
      }]
      this.categories.forEach(function(category) {
        selections.push({
          'value': category,
          'name': category,
        })
      });
      return selections
    },
    categories: function() {
      let categories = new Set()
      this.$store.state.words.forEach(function(word) {
        categories.add(word.category)
      });
      return Array.from(categories);
    },
    wordsByCategories: function() {
      let categories = {}
      this.selectedWords.forEach(function(word) {
        categories[word.category] = [];
      });
      this.selectedWords.forEach(function(word) {
        categories[word.category].push(word);
      });
      return categories
    }
  }
};
</script>
