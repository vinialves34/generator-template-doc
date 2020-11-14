const ckEditor = document.querySelector('#editor');
window.onload = () => {
    createEditor(ckEditor);
    submitFileCSV();
    selectMagicFields(ckEditor);
};

function createEditor(ckEditor) {
    DecoupledEditor
        .create(ckEditor)
        .then(editor => {
            const toolbarContainer = document.querySelector('#toolbar-container');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
            window.editor = editor;
        }).catch(error => {
            console.error(error);
        });
}

function submitFileCSV() {
    document.querySelector("#sendCSV").addEventListener('submit', (e) => {
        e.preventDefault();
        const fileCSV = new FileReader();
        
        fileCSV.onload = () => {
            addMagicFields(fileCSV.result);
            renderDocument(ckEditor, fileCSV.result);
            document.querySelector("#output").textContent = fileCSV.result;
            document.querySelector(".contentCSV").removeAttribute("style");
        }

        fileCSV.readAsText(document.querySelector("#document-csv").files[0]);
        document.querySelector("#render-doc").removeAttribute("style");
    });
}

function addMagicFields(dataCSV) {
    const magicFields = document.querySelector("#magic-field");
    let rows = dataCSV.split(/\r?\n|\r/);
    let optionsSelect = rows[0].split(',');
    let firstOption = magicFields.firstElementChild;
    magicFields.textContent = "";
    magicFields.appendChild(firstOption);

    optionsSelect.forEach((op, i) => {
        let optionField = document.createElement("option");
        let optionText = document.createTextNode(op);
        optionField.appendChild(optionText);
        optionField.value = op;

        magicFields.appendChild(optionField);
    });
}

function selectMagicFields(ckEditor) {
    const magicFields = document.querySelector("#magic-field");
    magicFields.addEventListener('change', () => {
        let valueField = document.createTextNode(`{{ ${magicFields.value} }}`);
        let indexElement = 0;

        if (ckEditor.children.length > 1) {
            indexElement = ckEditor.children.length - 1;
        }

        let elementEditor = ckEditor.children[indexElement];
        elementEditor.appendChild(valueField);
        magicFields.value = "";
    });
}

function renderDocument(ckEditor, dataCSV) {
    const btnRender = document.querySelector("#render-doc");
    btnRender.addEventListener('click', () => {
        let contentEditor = ckEditor.innerHTML;
        let nameRow;
        let resultData = [];

        if (dataCSV) {
            let rows = dataCSV.split(/\r?\n|\r/);
            let arrayDataRow = [];
            let arr = [];
                nameRow = rows[0].split(',');

            for (let k = 1; k < rows.length; k++) {
                if (rows[k] !== "") {
                    let dataRows = rows[k].split(',');
                    arrayDataRow.push(dataRows);
                }
            }

            for (let i = 0; i < arrayDataRow.length; i++) {
                for (let n = 0; n < nameRow.length; n++) {
                    arr[nameRow[n]] = arrayDataRow[i][n];
                }
                resultData.push(arr);
                arr = [];
            }
        }

        resultData.forEach((valueData, k) => {
            const divDocument = document.querySelector(".data-document");
            let viewDoc = document.createElement("pre");
                viewDoc.classList.add(`preview-${k}`);
            divDocument.appendChild(viewDoc);
            document.querySelector(`.preview-${k}`).innerHTML = replaceMagicFields(contentEditor, nameRow, valueData);
        });
    });
}

function replaceMagicFields(text, nameRow, dataDoc) {
    nameRow.forEach((row, i) => {
        text = text.replaceAll(`{{ ${row} }}`, `${dataDoc[row]}`);
    });

    return text;
}
