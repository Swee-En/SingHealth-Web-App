import { db } from "../loginPage/Login";

function handleChange(date) {
    this.setState({
        auditDate: date
    })
}

function onChecked(id) {
    const covid1 = this.state.covid1
    const index = covid1.findIndex(x => x.id === id);
    if (covid1[index].checked == "N") {
        covid1[index].checked = "Y";
        this.setState({ crit1_score: this.state.crit1_score + 1 });
    }
    else if (covid1[index].checked == "Y") {
        covid1[index].checked = "NA";
        this.setState({ crit1_score: this.state.crit1_score - 1 });
        this.setState({ total_crit1_score: this.state.total_crit1_score - 1 });
    }
    else {
        covid1[index].checked = "N";
        this.setState({ total_crit1_score: this.state.total_crit1_score + 1 });
    }
    this.setState(covid1)
}

function onChecked2(id) {
    const covid2 = this.state.covid2
    const index = covid2.findIndex(x => x.id === id);
    if (covid2[index].checked == "N") {
        covid2[index].checked = "Y";
        this.setState({ crit2_score: this.state.crit2_score + 1 });
    }
    else if (covid2[index].checked == "Y") {
        covid2[index].checked = "NA";
        this.setState({ crit2_score: this.state.crit2_score - 1 });
        this.setState({ total_crit2_score: this.state.total_crit2_score - 1 });
    }
    else {
        covid2[index].checked = "N";
        this.setState({ total_crit2_score: this.state.total_crit2_score + 1 });
    }
    this.setState(covid2)
}

function submitButtonHandle() {
    if (this.state.auditDate == ""){
        alert("Please select a date for audit.")
    }

    else if (this.state.auditAuditee == "") {
        alert("Please fill in the name of auditee.")
    }

    else if (this.state.auditAuditor == "") {
        alert("Please fill in the name of auditor(s).")
    }

    else {
        db.ref('Audit Report').child('Covid').child(this.state.auditAuditee).child(this.state.auditDate.toString()).set({
            auditDate: this.state.auditDate.toString(),
            auditAuditee: this.state.auditAuditee,
            auditAuditor: this.state.auditAuditor,
            auditComments: this.state.auditComments,
            auditRemarks1: this.state.auditRemarks1,
            auditRemarks2: this.state.auditRemarks2,

            covid1_1: this.state.covid1[0].checked,
            covid1_2: this.state.covid1[1].checked,
            covid1_3: this.state.covid1[2].checked,
            covid1_4: this.state.covid1[3].checked,
            covid1_5: this.state.covid1[4].checked,
            covid1_6: this.state.covid1[5].checked,
            covid1_7: this.state.covid1[6].checked,
            covid1_8: this.state.covid1[7].checked,
            
            covid2_1: this.state.covid2[0].checked,
            covid2_2: this.state.covid2[1].checked,
            covid2_3: this.state.covid2[2].checked,
            covid2_4: this.state.covid2[3].checked,
            covid2_5: this.state.covid2[4].checked

        })
        alert("Form submitted successfully. Returning to homepage.")
    }
}

export { handleChange, onChecked, onChecked2, submitButtonHandle }