window.onload = () => {
    const ckEditor = document.querySelector('#editor');
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
        }

        fileCSV.readAsText(document.querySelector("#document-csv").files[0]);
    });
}

function addMagicFields(dataCSV) {
    const magicFields = document.querySelector("#magic-field");
    let rows = dataCSV.split(/\r?\n|\r/);
    let optionsSelect = rows[0].split(',');

    optionsSelect.forEach((op, i) => {
        let optionField = document.createElement("option");
        let optionText = document.createTextNode(op);
        optionField.appendChild(optionText)
        optionField.value = op;

        magicFields.appendChild(optionField);
    });
}

function selectMagicFields(ckEditor) {
    const magicFields = document.querySelector("#magic-field");
    magicFields.addEventListener('change', () => {
        let valueField = document.createTextNode(`{{ ${magicFields.value} }}`);
        let indexElement = 0

        if (ckEditor.children.length > 1) {
            indexElement = ckEditor.children.length - 1;
        }

        let elementEditor = ckEditor.children[indexElement];
        elementEditor.appendChild(valueField);
    });
}