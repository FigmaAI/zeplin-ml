- 원본 `asis.json` 파일을 `tobe.json` 파일로 변경하는 자바스크립트 코드가 필요합니다.
- `asis.json`은 여러 계층의 `layers`를 가고 있습니다.
- layers 하위에 **<u>component_name을 가지고 있는 오브젝트들만</u>** 추출해서 배열로 만들어야 합니다. 
- 오브젝트는 `id`, `rect`, `component_name` 3가지 항목이 들어있어야 합니다. 

