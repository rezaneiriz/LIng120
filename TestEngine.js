module.exports = {
    testRegex: function(input, task) { // the brains of the regex tester
      var regexArr = input.split(/\r?\n/).filter(line => !line.startsWith("//"));
      var task = task;
  
      var allTests = { // the test strings and output after running through correct regex answers
        "articleReplacement":
          {"tests":
        [
            'atheanthe',
            'a table',
            'an apple',
            'a table and an apple',
            'the table',
            'the apple',
            'the book and the orange',
            'The table, the apple, a book, an orange.',
            'The box, the airplane, a computer, an apricot.',
            'The ggg, the ooo, a lll, an iii.',
            'A An A An A An',
            'The book. The orange'
          ],
          "answers":
          [
            'atheanthe',
            'the table',
            'the apple',
            'the table and the apple',
            'a table',
            'an apple',
            'a book and an orange',
            'A table, an apple, the book, the orange.',
            'A box, an airplane, the computer, the apricot.',
            'A ggg, an ooo, the lll, the iii.',
            'The The The The The The',
            'A book. An orange'
          ]
        },
        "corpusCleaning": {
          "tests": [
            'linguistics',
            'this is a test',
            'Remove, commas',
            'Remove,commas',
            ' Spaces in the beginning',
            'Spaces in the end ',
            'Double  spaces',
            'Double  spaces, and...',
            '  Catch---   all@test....::.    '
        ],
          "answers": [
            'linguistics',
            'this is a test',
            'Remove commas',
            'Remove commas',
            'Spaces in the beginning',
            'Spaces in the end',
            'Double spaces',
            'Double spaces and',
            'Catch all test'
          ]
        },
        "haigyPaigy": {
          "tests": [
            'xxx',
            'test',
            'bambambam',
            'a',
            'a fat alligator',
            'crocodile',
            'me crocodile',
            'daily measles boy',
            'me ear doome ooze',
            'fake word ending with ggge',
        ],
          "answers": [
            'xxx',
            'taigest',
            'baigambaigambaigam',
            'aiga',
            'aiga faigat aigallaigigaigataigor',
            'craigocaigodaigile',
            'maige craigocaigodaigile',
            'daigailaigy maigeaslaiges baigoy',
            'maige aigear daigoome aigooze',
            'faigake waigord aigendaiging waigith gggaige'
        ]
        },
        "turkishPlurals": {
            "tests": [
              'mak',
              'mIk',
              'mok',
              'mukzzzz',
              'mekkkkk',
              'mikkk',
              'mOkk',
              'mUk',
              'mO',
              'mI',
              'lalala',
              'lililok',
              'lIlIlOk'
        ],
          "answers": [
            'maklar',
            'mIklar',
            'moklar',
            'mukzzzzlar',
            'mekkkkkler',
            'mikkkler',
            'mOkkler',
            'mUkler',
            'mOler',
            'mIlar',
            'lalalalar',
            'lililoklar',
            'lIlIlOkler'
          ]
        }
      }
  
      var testStrings = allTests[task]["tests"];
      var resultStrings = allTests[task]["answers"];
      var pts = 0; // start at 0 points
      var ptsPoss = testStrings.length; // no. of points possible depends on number of tests above for the task
      var passFail = {}; // to keep track of which tests they passed and failed
  
      for (let i=0; i<testStrings.length; i++){ // for each test string
        var testString = testStrings[i];
        var resultString = resultStrings[i];
  
        for (let j=0; j<regexArr.length; j++){ // for each of their regular expressions
          let regexpStr = regexArr[j];
          var regexMatch = regexpStr.replace(/s\/(.*?)\/.*?\/\w+$/, "$1"); // get the MATCH from user input line
          var regexReplace = regexpStr.replace(/s\/.*?\/(.*?)\/\w+$/, "$1"); // get the REPLACE from user input line
          var regexFlags = regexpStr.replace(/s\/.*?\/.*?\/(\w*?)$/, "$1"); // get the FLAGS from user input line
          var realRegex = new RegExp(regexMatch, regexFlags); // create regex object using the MATCH and FLAGS
          var testString = testString.replace(realRegex, regexReplace); // test the regex object on the test string
        };
      if (testString == resultString) { // check if the user's test string matches the correct output string
        passFail["Test " + (i + 1)] = "PASS";
        pts++;
      } else {
        passFail["Test " + (i + 1)] = "FAIL";
      };
      var score = (pts/ptsPoss)*100; // calculate points
      score = score.toFixed(2); // round to two decimal points
      score = score.toString();
      }
  
      return {score: score, passFail: passFail};
    }
  };

  