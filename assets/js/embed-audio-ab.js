function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function toggle_mute(source_a, source_b, which) {
    if (which) {
        if (!iOS()) {
            source_b.volume = MUTE_VOLUME;
            source_a.volume = 1.0;
        } else {
            source_b.muted = true;
            source_a.muted = false;
        }
    } else {
        if (!iOS()) {
            source_a.volume = MUTE_VOLUME;
            source_b.volume = 1.0;
        } else {
            source_a.muted = true;
            source_b.muted = false;
        }
    }
}

const MUTE_VOLUME = 0.001;

document.querySelectorAll(".embed-audio-ab").forEach((element) => {
    var id = element.id;

    var source_a = element.querySelector(`#${id}-a`);
    var source_b = element.querySelector(`#${id}-b`);
    var playpause = element.querySelector(`#${id}-playpause`);

    var timerange = element.querySelector(`#${id}-time`);
    var label_time_position = element.querySelector(`label[for="${id}-time-position"]`);
    var label_time_duration = element.querySelector(`label[for="${id}-time-duration"]`);

    var abswitch = element.querySelector(`#${id}-switch`);
    var label_a = element.querySelector(`#${id}-label-a`);
    var label_b = element.querySelector(`#${id}-label-b`);

    source_a.load();
    source_b.load();
    toggle_mute(source_a, source_b, true);
    timerange.value = 0.0;

    source_a.addEventListener("durationchange", () => {
        var seconds = source_a.duration;

        var minutes = 0;
        if (seconds >= 60) {
            minutes = seconds / 60;
            seconds %= 60;
        }
        seconds = Math.ceil(seconds);
        seconds = String(seconds).padStart(2, '0');

        label_time_duration.innerText = `${minutes}:${seconds}`;
    });
    source_a.addEventListener("timeupdate", () => {
        var seconds = source_a.currentTime;

        var minutes = 0;
        if (seconds >= 60) {
            minutes = seconds / 60;
            seconds %= 60;
        }
        seconds = Math.ceil(seconds);
        seconds = String(seconds).padStart(2, '0');

        label_time_position.innerText = `${minutes}:${seconds}`;
        timerange.value = source_a.currentTime / source_a.duration;
    });
    source_a.addEventListener("ended", () => {
        source_a.pause();
        source_b.pause();

        source_a.currentTime = 0;
        source_b.currentTime = 0;

        playpause.setAttribute("data-state", "pause");
        playpause.innerText = "⏵";
    });

    playpause.addEventListener("click", (event) => {
        if (playpause.getAttribute("data-state") == "play") {
            playpause.setAttribute("data-state", "pause");
            playpause.innerText = "⏵";

            source_a.pause();
            source_b.pause();
        } else {
            playpause.setAttribute("data-state", "play");
            playpause.innerText = "⏸";

            source_a.play();
            source_b.play();
        }
    });

    timerange.addEventListener("change", (event) => {
        var p = timerange.value;
        var position = source_a.duration * p;
        source_a.currentTime = position;
        source_b.currentTime = position;
    });

    abswitch.addEventListener("click", (event) => {
        if (abswitch.checked) {
            label_a.setAttribute("hidden", "true");
            label_b.removeAttribute("hidden");

            toggle_mute(source_a, source_b, false);
        } else {
            label_a.removeAttribute("hidden");
            label_b.setAttribute("hidden", "true");

            toggle_mute(source_a, source_b, true);
        }
    });
});
