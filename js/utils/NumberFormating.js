function exponentialFormat(num, precision, mantissa = true) {
  
    return num.toStringWithDecimalPlaces(precision)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.array[0] < 0.001) return (0).toFixed(precision)
    let init = num.toString()
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    return portions[0]

    
}

function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    if (num.array[0] < 0.001) return (0).toFixed(precision)
    return num.toString(Math.max(precision,2))
}

function fixValue(x, y = 0) {
    return x || new ExpantaNum(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return new ExpantaNum(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}
function egg(n) {
  if(n == undefined) return 0
  return n
}
function format(decimal, precision = 2, small = false) {
    small = small || modInfo.allowSmall
    let precision2 = Math.max(3, precision)
    decimal = new ExpantaNum(decimal)
    let fmt = decimal.toString()
    if (decimal.abs().lt(1e-308)) return (0).toFixed(precision)
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision)
    if (decimal.lt("0.0001")) { return format(decimal.rec(), precision) + "⁻¹" }
    else if (decimal.lt(1)) {
        if (small) precision += 2
        if (fmt.length < precision + 2) { fmt += "0".repeat(precision - fmt.length + 2) }
        else { fmt = fmt.substring(0, precision + 2) }
    }
    else if (decimal.lt(1000)) {
        let f = fmt.split(".")
        if (precision == 0) {
            return commaFormat(decimal.floor())
        }
        else if (f.length == 1) {
            return fmt + "." + "0".repeat(precision)
        }
        else if (f[1].length < precision) {
            return fmt + "0".repeat(precision - f[1].length)
        }
        else {
            return f[0] + "." + f[1].substring(0, precision)
        }
    } else if (decimal.lt(1e9)) {
        return commaFormat(decimal, 0)
    } else if (decimal.lt("e1000000000")) {
        let mantissa = EN(10).pow(decimal.log10().sub(decimal.log10().floor()))
        let exp = decimal.log10().floor()
        let m = mantissa.toString().split(".")
        let p = decimal.lt("e1000") ? precision2 : 0
        if (p == 0) mantissa = m[0]
        else if (m.length == 1) mantissa = m[0] + "." + "0".repeat(p)
        else if (m[1].length < p) {
            mantissa = m[0] + "." + m[1] + "0".repeat(p - m[1].length)
        }
        else mantissa = m[0] + "." + m[1].substring(0, p)
        return mantissa + "e" + commaFormat(exp)
    }
    else if (decimal.lt("10^^5")) {
        let part1 = "e".repeat(egg(decimal.array[1]) + 1 - (decimal.gte(EN.E_MAX_SAFE_INTEGER)))
        if (part1 != "e") {
            decimal.array.pop()
            return part1 + format(decimal, precision2)
        }
        return "e" + format(decimal.log10(), precision2)
    }
    else if (decimal.lt("10^^^5")) {
        let part1 = "F".repeat(egg(decimal.array[2]) + 1 - (decimal.gte(EN.TETRATED_MAX_SAFE_INTEGER)))
        if (part1 != "F") {
            decimal.array.pop()
            return part1 + format(decimal, precision2)
        }
        return "F" + format(decimal.slog(), precision2)
    }
    else {
        /*if (decimal.lt("10^^^^5")) {
            //console.log(egg(decimal.array[3]))
            // Hmmmmmm
            let part1 = "G".repeat(egg(decimal.array[3]) + 1 - (decimal.gte("10^^^" + Number.MAX_SAFE_INTEGER)))
            if (part1 != "G") {
                decimal.array.pop()
                return part1 + format(decimal, precision2)
            }
            return "G" + format(decimal.hlog(3), precision2)
        }
        else if (decimal.lt("10{5}5")) {
            let part1 = "H".repeat(egg(decimal.array[4]) + 1 - (decimal.gte("10^^^^" + Number.MAX_SAFE_INTEGER)))
            if (part1 != "H") {
                decimal.array.pop()
                return part1 + format(decimal, precision2)
            }
            return "H" + format(decimal.hlog(4), precision2)
        }*/
        let e = decimal.toHyperE()
        let sp = e.split("#")
        sp[0] = "E" + format(sp[0].substring(1, 20), precision2)
        return sp.join("#")/*
    else{
      if(decimal.lt("10{998}5")){
        let qp = EN(6)
        let op=formatWhole(qp)
        while(decimal.lt("10{"+op+"}5")){
          qp=qp.add(1)
          op=formatWhole(qp)
        }
        qp=qp.sub(1)
        op=formatWhole(qp)
        let part1 = ("10{"+op+"}").repeat(egg(decimal.array[4])+1 - (decimal.gte("10^^^^"+Number.MAX_SAFE_INTEGER)))
      if(part1 != ("10{"+op+"}")) {
        decimal.array.pop()
        return part1+format(decimal)
      }
      return "10{"+op+"}" + format(decimal.hlog(op))
      }
    }*/
    }
    return fmt
} // w- what 

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
    if (EN(s).gte(31536000000)) return format(EN(s).div(31536000)) + " years"
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new ExpantaNum(x)
    let result = x.toString(precision)
    if (new ExpantaNum(result).gte(maxAccepted)) {
        result = new ExpantaNum(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}