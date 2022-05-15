var isDebugMode: boolean = true;
// show debug mode only
function v(msg: any) {
  if (!isDebugMode) {
  } else {
    console.log(msg);
  }
}

// show error
function e(msg: any) {
  if (!isDebugMode) {
  } else {
    console.error(msg);
  }
}

export default {
  v,
  e,
} as const;