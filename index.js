function fr(str, minlen) {
    var s = new String(str);

    if (s.length < minlen && s.search(/\./) == -1) s += ".";
    while (s.length < minlen) s += "0";

    return s;
}

function fl(str, minlen) {
    var s = new String(str);

    while (s.length < minlen) s = "0" + s;
    return s;
}

function GetDateStr(date) {
    var s;
    s = fl(date.getDate(), 2) + "/";
    s += fl(date.getMonth() + 1, 2) + "/";
    s += date.getFullYear() + " ";
    s += fl(date.getHours(), 2) + ":";
    s += fl(date.getMinutes(), 2) + ":";
    s += fl(date.getSeconds(), 2) + ".";
    s += fl(date.getMilliseconds(), 3);

    return s;
}

function Format(expr, decplaces) {
    var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
    while (str.length <= decplaces) str = "0" + str;
    var decpoint = str.length - decplaces;
    return str.substring(0, decpoint) + "." + str.substring(decpoint, str.length);
}

function GetVal(now, begin, end) {
    var processed = now.getTime() - begin.getTime();
    var total = end.getTime() - begin.getTime();

    return 100 * processed / total;
}

function GetStrPerc(val) {
    if (val < 0) {
        return "0%";
    }
    else if (val > 100) {
        return "100%";
    }
    else {
        return Format(val, 14) + "%";
    }
}

function GetStr(val, label_before, label_after, label_now) {
    if (val < 0) {
        return label_before;
    }
    else if (val > 100) {
        return label_after;
    }
    else {
        return GetStrPerc(val) + label_now;
    }
}

//

var now;

function Period(begin, end, idPrefix, sBefore, sPeriod, sAfter) {
    val = GetVal(now, begin, end);
    str = GetStr(val, sBefore, sAfter, sPeriod);

    document.getElementById(idPrefix + "l").innerHTML = str;
    document.getElementById(idPrefix + "p").style.width = GetStrPerc(val);
}

function Remain(end, idPrefix) {
    var remain = end.getTime() - now.getTime();

    SetRemain(idPrefix + "sec", remain, 1000);
    SetRemain(idPrefix + "min", remain, 1000 * 60);
    SetRemain(idPrefix + "hour", remain, 1000 * 60 * 60);
    SetRemain(idPrefix + "day", remain, 1000 * 60 * 60 * 24);
    SetRemain(idPrefix + "week", remain, 1000 * 60 * 60 * 24 * 7);
}

function SetTime(time, idLabel, sLabel) {
    if (!sLabel) sLabel = "%s";
    sLabel = sLabel.replace(/%s/, GetDateStr(time));
    if (document.getElementById(idLabel).innerHTML != sLabel)
        document.getElementById(idLabel).innerHTML = sLabel;
}

function OnInterval() {
    now = new Date();

    var sNow = "сейчас: " + GetDateStr(now);
    var year = now.getFullYear();
    if (now.getMonth() < 7) --year;

    var str, strperc, val, begin, end;

    //2025
    begin = new Date(year + 1, 4, 1, 12)
    end = new Date(year + 1, 5, 4)
    Period(begin, end, "td_progress", "отсчёт ещё не начался", " прошло", "отсчёт закончился");

    //now
    SetTime(now, "td_now", "сейчас: %s");

    //begin
    SetTime(begin, "td_begin");

    //end
    SetTime(end, "td_end");

    //remain
    Remain(end, "td_rem_");
}

function SetRemain(id, remain, one) {
    document.getElementById(id + "_label").innerHTML = Format(remain / one, Math.floor(Math.log(one) * Math.LOG10E));
    document.getElementById(id + "p").style.width = GetStrPerc((remain % one) * 100 / one);
}

function DrawProgress(idPrefix) {
    var output = "<div id=\"" + idPrefix + "\"><div class=\"progress\" id=\"" + idPrefix + "p\"></div></div>";
    document.write(output);
}

function DrawLabel(idPrefix) {
    var output = "<div class=\"label\" id=\"" + idPrefix + "l\"></div>";
    document.write(output);
}

function DrawLabProgress(idPrefix) {
    DrawProgress(idPrefix);
    DrawLabel(idPrefix);
}

function Init() {
    OnInterval();
    setInterval("OnInterval()", 10);
}
