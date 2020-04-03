const getId = (() => {
  var time = 0;
  return () => {
    time++;
    return "ripple_" + time;
  };
})();

class Ripple {
  constructor() {
    let obj = arguments[0] || {};
    this.type = "canvas";
    this.props = {
      id: getId(),
      info: 0,
      alpha: obj.alpha || 0.5
    };
    this.events = {
      draw: (view, ctx) => {
        ctx.fillColor = obj.color || $color("white");
        ctx.beginPath();
        ctx.addArc(
          view.frame.width / 2,
          view.frame.height / 2,
          view.info / 2,
          0,
          Math.PI * 2,
          false
        );
        ctx.fillPath();
      }
    };
    this.addClearView = obj.addClearView;
    this.tappedHandler = obj.tappedHandler;
    this.longPressedHandler = obj.longPressedHandler;
    this.duration = obj.duration || 0.8;
    this.longPressedStopDuration = obj.longPressedStopDuration || 0.5;
    this.size = obj.size || 4.1;
    this.index = obj.index || Infinity;
    this.completionHandler = obj.completionHandler || new Function();
  }

  start(sourceView, location) {
    this.props.frame = $rect(location.x, location.y, 0, 0);
    this.props.info =
      Math.sqrt((sourceView.frame.height * sourceView.frame.width) / Math.PI) *
      2 *
      this.size;
    let views = sourceView.views;
    try {
      if (
        views[views.length - 1].id != "ClearView" &&
        this.addClearView != false
      )
        throw null;
    } catch (error) {
      sourceView.add({
        type: "view",
        props: {
          id: "ClearView"
        },
        layout: $layout.fill
      });
    } finally {
      sourceView.insertAtIndex(
        $ui.create(this),
        !isFinite(this.index)
          ? views.length - 1 + (views.length == 0 ? 1 : 0)
          : this.index
      );
    }
    this.sourceView = sourceView;
    $ui.animate({
      duration: this.duration,
      animation: () => {
        $(this.props.id).frame = $rect(
          location.x - this.props.info / 2,
          location.y - this.props.info / 2,
          this.props.info,
          this.props.info
        );
      },
      completion: () => {
        this.longPressed = true;
        if (!this.stopped && this.longPressedHandler) {
          this.stop();
          this.longPressedHandler(sourceView);
        }
      }
    });
  }

  stop(cancel) {
    if (this.stopped) return;
    let id = this.props.id;
    $ui.animate({
      duration: this.longPressed ? this.longPressedStopDuration : this.duration,
      animation: () => {
        $(id).alpha = 0;
      },
      completion: () => {
        $(id).remove();
        this.completionHandler();
      }
    });
    if (!cancel && this.tappedHandler) this.tappedHandler(this.sourceView);
    this.stopped = true;
  }

  moved(location) {
    let frame = this.sourceView.frame;
    if (
      location.x > frame.width ||
      location.x < 0 ||
      location.y > frame.height ||
      location.y < 0
    ) {
      this.stop(true);
      this.stopped = true;
    }
  }
}

module.exports = Ripple;
