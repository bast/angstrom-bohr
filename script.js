;
(function(angular) {
    'use strict';


    function isNumeric(num) {
        return !isNaN(num);
    }


    // http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
    function decimalPlaces(num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
            return 0;
        }
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    }


    function toFloat(num, decPlaces) {
        return num.toFixed(decPlaces);
    }


    function convertNumbers(input, factor) {
        var lines_in = input.split("\n");
        var lines_out = [];
        for (var i = 0; i < lines_in.length; i++) {
            var words_in = lines_in[i].split(" ");
            var words_out = [];
            for (var j = 0; j < words_in.length; j++) {
                var word = words_in[j];
                if (words_in[j] != "") {
                    if (isNumeric(words_in[j])) {
                        var num_dec = decimalPlaces(words_in[j])
                        word = toFloat(words_in[j] * factor, num_dec);
                    }
                }
                words_out.push(word);
            }
            lines_out.push(words_out.join(" "));
        }
        return lines_out.join("\n");
    }


    angular.module('myapp', [])
        .filter('convert', function() {
            return function(input, factor) {
                input = input || '';
                return convertNumbers(input, factor);
            };
        })
        .controller('mycontroller', ['$scope', '$http', function($scope, $http) {
            $scope.angstrom = '';
            $scope.bohr = '';
            $scope.factor = 0.52917721067;
            $scope.getGitInfo = function() {
                $scope.loaded = false;
                $http.get("https://api.github.com/repos/bast/angstrom-bohr/git/refs/heads/gh-pages")
                    .success(function(data) {
                        $scope.last_sha = data.object.sha;
                        $scope.last_sha_short = data.object.sha.substring(0, 8);
                        $http.get("https://api.github.com/repos/bast/angstrom-bohr/commits/" + $scope.last_sha)
                            .success(function(data) {
                                $scope.name = data.commit.author.name;
                                $scope.user = data.author.login;
                                $http.get("https://api.github.com/users/" + $scope.user)
                                    .success(function(data) {
                                        $scope.html_url = data.html_url;
                                        $scope.avatar_url = data.avatar_url;
                                        $scope.loaded = true;
                                    })
                            })
                    })
            }
            $scope.getGitInfo();

        }]);

})(window.angular);
