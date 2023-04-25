use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionResult {
    pub result: bool,
    pub error: Option<String>,
}

impl From<ActionResult> for String {
    fn from(action_result: ActionResult) -> String {
        action_result.error.unwrap()
    }
}
