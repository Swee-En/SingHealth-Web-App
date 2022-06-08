import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold"
    },
    headerTextWhite: {
      color: 'white',
      fontSize: 20,
      fontWeight: "bold"
    },
    normalText: {
      fontSize: 16
    },
    subnormalText: {
      fontSize: 14
    },
    basicTextInput: {
      height: 40,
      borderColor: 'black',
      borderWidth: 1 
    },
    dashboardContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80
    },
  
    dashboardTableHeader: {
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
  
    dashboardTableRow: {
      flexDirection: "row",
      height: 40,
      alignItems: "center",
    },
  
    dashboardColumnHeader: {
      width: "20%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#EF820D",
    },
  
    dashboardColumnHeaderTxt: {
      color: "white",
      fontWeight: "bold",
    },
  
    dashboardColumnRowTxt: {
      textAlign: "center",
    }
  });
export default styles;