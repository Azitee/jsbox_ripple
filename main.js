"use strict"

const Ripple = require("scripts/ripple");
var ripple;

$ui.render({
  props: {
    navBarHidden: true,
    bgcolor: $color("#040d15")
  },
  views: [
    {
      type: "view",
      props: {
        radius: 40
      },
      layout: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(230, 80));
      },
      views: [
        {
          type: "gradient",
          props: {
            colors: [$color("#0162c8"), $color("#55e7fc")],
            locations: [0.0, 1.0],
            startPoint: $point(0, 0.5),
            endPoint: $point(1, 0.5)
          },
          layout: $layout.fill
        },
        {
          type: "label",
          props: {
            text: "BUTTON",
            align: $align.center,
            font: $font("bold", 23),
            textColor: $color("white")
          },
          layout: $layout.fill
        }
      ],
      events: {
        touchesBegan: (sender, location) => {
          ripple = new Ripple({
            size: 3,
            duration: 0.8,
            longPressedStopDuration: 0.3,
            tappedHandler: sender => {
              sender.views[1].text = "TAPPED";
            }
          });
          ripple.start(sender, location);
        },
        touchesMoved: (sender, location) => {
          ripple.moved(location);
        },
        touchesEnded: sender => {
          ripple.stop();
        }
      }
    }
  ]
});
