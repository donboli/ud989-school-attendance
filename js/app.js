/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var model = {
      init: function() {
        this.attendance = JSON.parse(localStorage.attendance);
      },

      toggleAttend: function(id, day) {
        this.attendance[id][day] = !this.attendance[id][day];
        localStorage.attendance = JSON.stringify(this.attendance);
      },

      getAttendance: function() {
        return this.attendance;
      }
    };

    var octopus = {
      init: function() {
        model.init();
        view.init();
      },

      toggleAttend: function(id, day) {
        model.toggleAttend(id, day);
        view.render();
      },

      getAttendance: function() {
        return model.getAttendance();
      }
    };

    var view = {
      init: function() {
        this.$students = $('.student');

        this.$students.on('click', 'input', function() {
          var day = $(this).data('day');
          var id = $(this).closest('.student').data('id');

          octopus.toggleAttend(id, day);
        });

        this.render();
      },

      render: function() {
        var attendees = octopus.getAttendance();
        var $student, attendee, $input, days;

        this.$students.each(function() {
          $student = $(this);
          attendee = attendees[$student.data('id')];

          // set checkboxes
          $student.find('input').each(function() {
            $input = $(this);
            $input.attr('checked', attendee[$input.data('day')]);
          });

          // set days missed
          days = attendee.reduce(function(total, bool) {
            return total + !bool;
          }, 0);

          $student.find('.missed-col').text(days);
        });
      }
    };

    octopus.init();
}());
