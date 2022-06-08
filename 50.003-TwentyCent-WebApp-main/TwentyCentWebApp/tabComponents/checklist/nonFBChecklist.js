import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, Image, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-datepicker'
import DropDownPicker from 'react-native-dropdown-picker';
import 'react-datepicker/dist/react-datepicker.css'

import { handleChange, handlechange2, onChecked, onChecked1_2, onChecked2, onChecked3, onChecked3_2, onChecked3_3, submitButtonHandle } from "../../checklistFiles/nonFBchecklistFunc"
import { UploadPhotos11, UploadPhotos12, UploadPhotos13 } from "../../frontendUtils/UploadPhoto"
const nonFB1 = require('../../checklistFiles/nonFB1.json')
const nonFB1_2 = require('../../checklistFiles/nonFB1_2.json')
const nonFB2 = require('../../checklistFiles/nonFB2.json')
const nonFB3 = require('../../checklistFiles/nonFB3.json')
const nonFB3_2 = require('../../checklistFiles/critItems5_2.json')
const nonFB3_3 = require('../../checklistFiles/critItems5_3.json')
const nonFBimage = require('../../checklistFiles/nonFBimage.json')

class nonFBChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditDate: new Date(),
      auditAuditee: "",
      auditAuditor: "",
      auditComments: "",
      rectificationDate: "",

      nonFB1: nonFB1,
      nonFB1_2: nonFB1_2,
      crit1_score: 0,
      total_crit1_score: 6,

      nonFB2: nonFB2,
      crit2_score: 0,
      total_crit2_score: 12,

      nonFB3: nonFB3,
      nonFB3_2: nonFB3_2,
      nonFB3_3: nonFB3_3,
      crit3_score: 0,
      total_crit3_score: 16,

      nonFBimage: nonFBimage,

      tag1: "",
      tag2: "",
      tag3: ""

    }
  }

  handleChange = handleChange
  handlechange2 = handlechange2
  onChecked = onChecked
  onChecked1_2 = onChecked1_2
  onChecked2 = onChecked2
  onChecked3 = onChecked3
  onChecked3_2 = onChecked3_2
  onChecked3_3 = onChecked3_3
  submitButtonHandle = submitButtonHandle

  render() {
    return (

      // the entire view
      <ScrollView style = {{backgroundColor: 'white'}}>

        {/* front page */}
        <View style={styles.coverPageView}>
          <View style={styles.bigTitle}>
            <Text style={styles.underlineBold}>SINGHEALTH RETAIL</Text>
            <Text style={styles.boldText}>Audit Checklist (Non-F&B) Guide</Text>
          </View>
          <Text style={styles.coverText}>
            1.  {'\t'} Quality/Internal audit will be carried out on the Demised Premises at least twice monthly throughout the Term in accordance with this Audit Checklist.
          </Text>
          <Text style={styles.coverText}>
            2.  {'\t'} One (1) point will be awarded for each standard complied, and a percentage tabulation of the total score will be given.
          </Text>
          <Text style={styles.coverText}>
            3.  {'\t'} A warning letter will be issued for failure to achieve a performance score of at least ninety-five percent (95%) for each audit
            and one (1) demerit point will be issued after three (3) warning letters. An accumulation of six (6) demerit points throughout the
            Term will allow the [name of Master Tenant] to prematurely terminate the SingHealth Retail Tenancy Agreement.
          </Text>

          {/* The table view */}
          <View style={styles.tableView}>

            {/* Each row in table view */}
            <View style={styles.rowViewBig}>
              <Text style={styles.boldText}>Date: </Text>
              <View style={styles.datePickerView}>
                <DatePicker
                  selected={this.state.auditDate}
                  onChange={(date) => this.handleChange(date)}
                  style={styles.datePickerStyle}
                  name="Audit Date"
                  popperProps={{ positionFixed: true }}
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

            <View style={styles.rowView}>
              <Text style={styles.boldText}>Total Score: </Text>
              <View style={styles.datePickerView}>
                <Text style={styles.boldText}>{this.state.crit1_score + this.state.crit2_score + this.state.crit3_score}</Text>
              </View>
            </View>

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
                style={styles.input}
                value={this.state.commentsBox}
              />
            </View>

          </View>
        </View>

        {/* page1 */}
        <View style={styles.pageView}>

          {/* view for the big title */}
          <View style={styles.crit1Items}>
            <Text style={styles.title}>
              1. Professionalism & Staff Hygiene (20%)
            </Text>

            <Text style={styles.title}>
              Points(s) Awarded
            </Text>
          </View>

          {/* view with the green background */}
          <View style={styles.secondTitleView}>

            {/* The small titles */}
            <Text style={styles.secondTitle}>
              Professionalism
            </Text>
          </View>

          {/* Checklist for the part under professionalism */}
          {this.state.nonFB1.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* view with the green background */}
          <View style={styles.secondTitleView}>

            {/* The small titles */}
            <Text style={styles.secondTitle}>
              Staff Hygiene
            </Text>
          </View>

          {/* Checklist for the part under staff hygiene */}
          {this.state.nonFB1_2.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked1_2(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* score for professionalism and hygiene aka crit_one_score */}
          <View style={styles.scoreView}>
            <Text style={styles.score}> Score: </Text>
            <Text style={styles.secondTitle}> {this.state.crit1_score}/{this.state.total_crit1_score} </Text>
          </View>

          <UploadPhotos11 />

          <View style={styles.dropView}>
            <DropDownPicker
              items={[
                { label: "Professionalism", value: "Professionalism", viewStyle: styles.dropStyle },
                { label: "Operating hours", value: "Operating hours" },
                { label: "Staff", value: "Staff" },

                { label: "Staff Hygiene", value: "Staff Hygiene", viewStyle: styles.dropStyle },
                { label: "Staff tidiness", value: "Staff tidiness" },
                { label: "Staff fitness", value: "Staff fitness" }
              ]}
              defaultValue={this.state.tag1}
              placeholder="Please select a category"
              containerStyle={{ height: 40 }}
              style={styles.dropItemStyle}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa', maxHeight: 10 }}
              onChangeItem={item => this.setState({
                tag1: item.value
              })}
            />
          </View>

        </View>

        {/* page2 */}
        <View style={styles.pageView}>

          {/* view for the big title */}
          <View style={styles.crit1Items}>
            <Text style={styles.title}>
              2. Housekeeping & General Cleanliness (40%)
            </Text>

            <Text style={styles.title}>
              Points(s) Awarded
            </Text>
          </View>

          {/* view with the green background */}
          <View style={styles.secondTitleView}>

            {/* The small titles */}
            <Text style={styles.secondTitle}>
              General Environment Cleanliness
            </Text>
          </View>

          {/* Checklist for the part under professionalism */}
          {this.state.nonFB2.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked2(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* score for professionalism and hygiene aka crit_one_score */}
          <View style={styles.scoreView}>
            <Text style={styles.score}> Score: </Text>
            <Text style={styles.secondTitle}> {this.state.crit2_score}/{this.state.total_crit2_score} </Text>
          </View>

          <UploadPhotos12 />

          <View style={styles.dropView}>
            <DropDownPicker
              items={[
                { label: "General Environment Cleanliness", value: "General Environment Cleanliness", viewStyle: styles.dropStyle },
                { label: "Cleaning and maintenance records", value: "Cleaning and maintenance records" },
                { label: "Store tidiness/boundary", value: "Store tidiness/boundary" },
                { label: "Pest control", value: "Pest control" },
                { label: "Furniture cleanliness/maintenance", value: "Furniture cleanliness/maintenance" },
                { label: "Waste bins", value: "Waste bins" }
              ]}
              defaultValue={this.state.tag2}
              placeholder="Please select a category"
              containerStyle={{ height: 40 }}
              style={styles.dropItemStyle}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa', maxHeight: 10 }}
              onChangeItem={item => this.setState({
                tag2: item.value
              })}
            />
          </View>

        </View>

        {/* page3 */}
        <View style={styles.pageView}>

          {/* view for the big title */}
          <View style={styles.crit1Items}>
            <Text style={styles.title}>
              3. Workplace Safety & Health (40%)
            </Text>

            <Text style={styles.title}>
              Points(s) Awarded
            </Text>
          </View>

          {/* view with the green background */}
          <View style={styles.secondTitleView}>

            {/* The small titles */}
            <Text style={styles.secondTitle}>
              General Safety
            </Text>
          </View>

          {/* Checklist for the part under professionalism */}
          {this.state.nonFB3.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked3(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* view with the green background */}
          <View style={styles.secondTitleView}>

            {/* The small titles */}
            <Text style={styles.secondTitle}>
              Fire and Emergency Safety
            </Text>
          </View>

          {/* Checklist for the part under staff hygiene */}
          {this.state.nonFB3_2.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked3_2(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* view with the green background */}
          <View style={styles.secondTitleView}>

            {/* The small titles */}
            <Text style={styles.secondTitle}>
              Electrical Safety
            </Text>
          </View>

          {/* Checklist for the part under staff hygiene */}
          {this.state.nonFB3_3.map((item, key) => (
            <View key={key} style={styles.crit1Items}>
              <Text style={styles.critText}>{item.key}</Text>
              <TouchableOpacity value={item.checked} onPress={() => this.onChecked3_3(item.id)} style={styles.touchableStyle}>
                <Text style={styles.touchableText}> {item.checked} </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* score for professionalism and hygiene aka crit_one_score */}
          <View style={styles.scoreView}>
            <Text style={styles.score}> Score: </Text>
            <Text style={styles.secondTitle}> {this.state.crit3_score}/{this.state.total_crit3_score} </Text>
          </View>

          <UploadPhotos13 />

          <View style={styles.dropView}>
            <DropDownPicker
              items={[
                { label: "General Safety", value: "General Safety", viewStyle: styles.dropStyle },
                { label: "Possession of certificate/MSDS", value: "Possession of certificate/MSDS" },
                { label: "Storage/labelling of chemicals", value: "Storage/labelling of chemicals" },
                { label: "Safety shoes & attire", value: "Safety shoes & attire" },
                { label: "Equipment, crockery and utensils safely stored and in good condition", value: "Equipment, crockery and utensils safely stored and in good condition" },
                { label: "Stacking of goods", value: "Stacking of goods" },
                { label: "Proper signage in working order", value: "Proper signage in working order" },
                { label: "Clutter under sink", value: "Clutter under sink" },

                { label: "Fire and Emergency Safety", value: "Fire and Emergency Safety", viewStyle: styles.dropStyle },
                { label: "Tools are available and well-equipped", value: "Tools are available and well-equipped" },
                { label: "Obstruction of escape routes and exits", value: "Obstruction of escape routes and exits" },

                { label: "Electrical Safety", value: 37, viewStyle: styles.dropStyle },
                { label: "Overloading of electrical sockets", value: "Overloading of electrical sockets" },
                { label: "Plugs and cords", value: "Plugs and cords" },
                { label: "Power points", value: "Power points" },
                { label: "Electrical panels/DBs are not covered", value: "Electrical panels/DBs are not covered" }
              ]}
              defaultValue={this.state.tag3}
              placeholder="Please select a category"
              containerStyle={{ height: 40 }}
              style={styles.dropItemStyle}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa', maxHeight: 10 }}
              onChangeItem={item => this.setState({
                tag3: item.value
              })}
            />
          </View>

        </View>

        {/* final page */}
        <View style={styles.finalPageView}>

          <View style={styles.rowView}>
            <Text style={styles.boldText}>Rectification Deadline: </Text>
            <View style={styles.datePickerView}>
              <DatePicker
                selected={this.state.rectificationDate}
                onChange={(date2) => this.handlechange2(date2)}
                style={styles.datePickerStyle}
                minDate={this.state.auditDate}
                name="Rectification Date"
                dateFormat="dd/MM/yyyy"
              />
            </View>

          </View>

          <View style={{ marginTop: 200, marginBottom: 35 }}>
            <Text style={styles.underlineBold}>NON F & B</Text>
            <Text style={styles.boldText}>Working: </Text>

            <View style={styles.crit1Items}>
              <Text style={styles.critText}>Professionalism & Staff Hygiene</Text>
              <Text style={styles.critText}>{((this.state.crit1_score / this.state.total_crit1_score) * 20).toFixed(2)}/20%</Text>
            </View>

            <View style={styles.crit1Items}>
              <Text style={styles.critText}>Housekeeping & General Cleanliness</Text>
              <Text style={styles.critText}>{((this.state.crit2_score / this.state.total_crit2_score) * 40).toFixed(2)}/40%</Text>
            </View>

            <View style={styles.crit1Items}>
              <Text style={styles.critText}>Workplace Safety & Health</Text>
              <Text style={styles.critText}>{((this.state.crit3_score / this.state.total_crit3_score) * 40).toFixed(2)}/40%</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.critText}>Total</Text>
              <Text style={styles.critText}>{(((this.state.crit1_score / this.state.total_crit1_score) * 20) + ((this.state.crit2_score / this.state.total_crit2_score) * 40) + ((this.state.crit3_score / this.state.total_crit3_score) * 40)).toFixed(2)}/100%</Text>
            </View>

            <View style={styles.buttonView}>
              <Button
                title="Submit" onPress={() => {
                  this.submitButtonHandle()

                  
                }}
              />
            </View>

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
    alignItems: 'center'
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
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
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

  commentsBox: {
    width: "80%",
    height: 500,
    padding: 10
  },

  commentsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    borderColor: 'skyblue',
    borderWidth: 1,
    padding: 10,
    height: 200
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

  dropStyle: {
    backgroundColor: "lightcyan",
    paddingLeft: 10
  },

  dropView: {
    marginBottom: 90
  },

  dropItemStyle: {
    backgroundColor: 'lightskyblue'
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
    height: 200
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

export default nonFBChecklist;