import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, Image, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { handleChange, onChecked, onChecked2, submitButtonHandle } from "../../checklistFiles/covidFunc"

const covid1 = require('../../checklistFiles/covid1.json')
const covid2 = require('../../checklistFiles/covid2.json')

class FBChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditDate: "",
      auditAuditee: "",
      auditAuditor: "",
      auditComments: "",
      auditRemarks1: "",
      auditRemarks2: "",

      covid1: covid1,
      covid2: covid2

    }
  }

  handleChange = handleChange
  onChecked = onChecked
  onChecked2 = onChecked2
  submitButtonHandle = submitButtonHandle

  render() {
    return (

      // the entire view
      <ScrollView style = {{backgroundColor: 'white'}}>

        {/* front page */}
        <View style={styles.coverPageView}>
          <View style={styles.bigTitle}>
            <Text style={styles.underlineBold}>SINGHEALTH RETAIL</Text>
            <Text style={styles.boldText}>COVID SAFE MANAGEMENT MEASURES COMPLIANCE CHECKLIST GUIDE</Text>
          </View>

          {/* The table view */}
          <View style={styles.tableView}>

            {/* Each row in table view */}
            <View style={styles.rowView}>
              <Text style={styles.boldText}>Date: </Text>
              <View style={styles.datePickerView}>
                <DatePicker
                  selected={this.state.auditDate}
                  onChange={(date) => this.handleChange(date)}
                  style={styles.datePickerStyle}
                  popperProps={{ positionFixed: true }}
                  name="Audit Date"
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                />
              </View>
            </View>

            <View style={styles.rowView}>
              <Text style={styles.boldText}>Auditee: </Text>
              <TextInput
                placeholder="Enter Auditee"
                onChangeText={(text) => {
                  this.setState({
                    auditAuditee: text
                  })
                }}
                style={styles.input}
                value={this.state.auditAuditee}
              />
            </View>

            <View style={styles.rowView}>
              <Text style={styles.boldText}>Auditor(s)
              <Text style={styles.italicText}>(Name/Department): </Text>
              </Text>

              <TextInput
                placeholder="Enter Auditor(s)"
                onChangeText={(text) => {
                  this.setState({
                    auditAuditor: text
                  })
                }}
                multiline
                style={styles.input}
                value={this.state.auditAuditor}
              />
            </View>

          </View>
        </View>

        {/* page1 */}
        <View style={styles.pageView}>

          {/* view for the big title */}
          <View style={styles.crit1Items}>
            <Text style={styles.title}>
              Part 1: Safe Management Measures for Front-of-House
            </Text>

            <Text style={styles.title}>
              Y/N/NA
            </Text>
          </View>

          {/* Checklist for the part under professionalism */}
          {this.state.covid1.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.commentsView}>
            <View style={styles.commentsTextView}>
              <Text style={styles.boldText}>Remarks: </Text>
            </View>
            <TextInput
              placeholder="Enter Remarks"
              onChangeText={(text) => {
                this.setState({
                  auditRemarks1: text
                })
              }}
              multiline
              style={styles.input3}
            />
          </View>

        </View>

        {/* page2 */}
        <View style={styles.pageView}>

          {/* view for the big title */}
          <View style={styles.crit1Items}>
            <Text style={styles.title}>
              Part 2: Staff Hygiene & Safe Management Measures
            </Text>

            <Text style={styles.title}>
              Y/N/NA
            </Text>
          </View>

          {/* Checklist for the part under professionalism */}
          {this.state.covid2.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked2(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.commentsView}>
            <View style={styles.commentsTextView}>
              <Text style={styles.boldText}>Remarks: </Text>
            </View>
            <TextInput
              placeholder="Enter Remarks"
              onChangeText={(text) => {
                this.setState({
                  auditRemarks2: text
                })
              }}
              multiline
              style={styles.input3}
            />
          </View>

        </View>

        {/* final page */}
        <View style={styles.finalPageView}>

          <View style={styles.commentsView}>
            <View style={styles.commentsTextView}>
              <Text style={styles.boldText}>Comments: </Text>
            </View>
            <TextInput
              placeholder="Enter Comments"
              onChangeText={(text) => {
                this.setState({
                  auditComments: text
                })
              }}
              multiline
              style={styles.input2}
            />
          </View>

          <View style={styles.buttonView}>
            <Button
              title="Submit" onPress={() => {
                this.submitButtonHandle()
              }}
            />
          </View>

        </View>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  bigTitle: {
    width: "100%",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100
  },

  boldText: {
    fontWeight: "bold",
    fontSize: 17,
    marginVertical: 10
  },

  buttonView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: 'center',
    marginTop: 20
  },

  crit1Items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'skyblue',
    borderWidth: 1,
    padding: 10
  },

  critText: {
    fontSize: 16,
    marginRight: 25
  },

  coverPageView: {
    marginHorizontal: 20,
    marginVertical: 50
  },

  coverText: {
    fontSize: 16,
    marginVertical: 10
  },

  commentsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    borderColor: 'skyblue',
    borderWidth: 1,
    padding: 10
  },

  commentsTextView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%'
  },

  datePickerView: {
    width: "49%"
  },

  datePickerStyle: {
    borderColor: 'skyblue',
    height: 10,
    margin: 20,
    position: "absolute"
  },

  finalPageView: {
    flexDirection: 'column',
    margin: 20
  },

  findingBox: {
    width: "100%",
    height: 100,
    padding: 10
  },

  findingView: {
    width: "100%",
    borderColor: 'skyblue',
    borderWidth: 3,
    padding: 10
  },

  italicText: {
    fontStyle: "italic"
  },

  input: {
    width: "50%",
    height: "90%",
    padding: 10
  },

  input2: {
    width: "90%",
    height: "98%",
    padding: 10
  },

  input3: {
    width: "90%",
    padding: 10
  },

  pageView: {
    marginHorizontal: 20,
    marginVertical: 50
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    borderColor: 'skyblue',
    borderWidth: 1,
    padding: 10
  },

  rowViewBig: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    borderColor: 'skyblue',
    borderWidth: 1,
    padding: 10,
    height: 300
  },

  scrollView: {
    flexDirection: "column"
  },

  secondTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'skyblue',
    borderWidth: 1,
    backgroundColor: "aquamarine"
  },

  score: {
    fontWeight: "bold",
    fontSize: 18
  },

  scoreView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'skyblue',
    borderWidth: 1,
    padding: 10,
    backgroundColor: "gainsboro"
  },

  secondTitle: {
    fontWeight: "bold",
    fontSize: 18,
    padding: 10
  },

  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'skyblue',
    borderWidth: 2,
    padding: 10
  },

  tableView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },

  touchableStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: 'skyblue',
    borderWidth: 1,
    width: 35,
    height: 35,
    margin: 2
  },

  touchableText: {
    alignSelf: "center"
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingVertical: 10
  },

  underlineBold: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 20
  }

})

export default FBChecklist;