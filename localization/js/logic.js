$(function() {
  var SERVER_URL = location.protocol + "//" + location.hostname + ":5001/";

  $.ajax({
    url: SERVER_URL + "languages",
    type: "get",
    dataType: "json"
  }).done(function(data) {
      $(":submit").click(function(e) {
        e.preventDefault();

        var output = {};
        $.each($("ul li"), function(key, value) {
          var word = $(value).find("label").text();
          var translate = $(value).find("input").val();

          output[word] = translate;
        });

        $.ajax({
          url: SERVER_URL + "save",
          dataType: "json",
          type: "post",
          data: {
            lang: $("select").val(),
            translate: JSON.stringify(output)
          }
        }).done(function(response) {

          });
      });

      $.each(data, function(key, value) {
        var el = $("<option/>", {
          value: key,
          text: key
        });

        $("select").append(el.clone());
      });

      $.ajax({
        url: "template.json",
        dataType: "json"
      }).done(function(templateData) {

          $("select").change(function() {
            var value = $(this).val();

            if (value != -1) {
              var result = $.extend({}, templateData, data[value].translate);

              renderTable(result);
            }
          });

        });
    });

  function renderTable(result) {
    $("ul").empty();

    $.each(result, function(key, value) {
      var label = $("<label/>", {
        text: key
      });

      var input = $("<input/>", {
        value: value
      });

      var li = $("<li />");

      li.append(label.clone());
      li.append(input.clone());

      $("ul").append(li.clone());
    });
  }
});
