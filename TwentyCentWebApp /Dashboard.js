import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from "lodash"

import { db } from "./Login.js"

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        "Date",
        "Outlet",
        "Auditor",
        "Status",
        "Actions"
      ],
      direction: null,
      selectedColumn: null,
      auditReports: []
    }
  }

   // from db
  componentDidMount() {
    db.ref("AuditReports").on("value", snapshot => {
      let auditReportList = [];
      // loop each child and push to array
      snapshot.forEach(snap => {
        auditReportList.push(snap.val());
        this.setState({
          auditReports: auditReportList
        })
      });
    })
  }

  sortTable(column) {
    const newDirection = this.state.direction === "desc" ? "asc" : "desc"
    const sortedData = _.orderBy(this.state.auditReports, [column], [newDirection])
    this.setState({
      selectedColumn: column,
      direction: newDirection,
      auditReports: sortedData
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.auditReports}
          style={{ width: "90%" }}
          keyExtractor={(item, index) => index + ""}
          ListHeaderComponent={
            <View style={styles.tableHeader}>
              {
                this.state.columns.map((column, index) => {
                  {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.columnHeader}
                        onPress={() => this.sortTable(column)}>
                        <Text style={styles.columnHeaderTxt}>{column + " "}
                          {this.state.selectedColumn === column && <MaterialCommunityIcons
                            name={this.state.direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"}
                          />
                          }
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                })
              }
            </View>
          }
          stickyHeaderIndices={[0]}   // prop to make Table Header stick and not scroll
          renderItem={({ item }) => {
            return (
              <View style={{
                ...styles.tableRow, backgroundColor: "#fff8e7", padding: "16", margin: 8, borderRadius: 16
              }}>
                <Text style={styles.columnRowTxt}>{item.Date}</Text>
                <Text style={styles.columnRowTxt}>{item.Outlet}</Text>
                <Text style={styles.columnRowTxt}>{item.Auditor}</Text>
                <Text style={styles.columnRowTxt}>{item.Status}</Text>
                <Button
                  title="Update Status"
                  color="#f6ab59"
                  onPress={() => console.log("Go to Audit Page")}
                />
              </View>
            )
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#EF820D",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 50
  },
  tableRow: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  columnHeaader: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "bold",
  },
  columnRowTxt: {
    textAlign: "center",
  }
})

export default Dashboard