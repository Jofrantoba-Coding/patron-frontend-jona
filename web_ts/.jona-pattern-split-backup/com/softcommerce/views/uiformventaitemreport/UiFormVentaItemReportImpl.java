package com.softcommerce.views.uiformventaitemreport;


import com.softcommerce.comboboxmodel.ComboModelFamilia;
import com.softcommerce.comboboxmodel.ComboModelItem;
import com.softcommerce.comboboxmodel.ComboModelMarca;
import com.softcommerce.entity.BeanVentaXItem;
import com.softcommerce.entity.Item;
import com.softcommerce.gui.*;
import com.softcommerce.logic.LogicFamilia;
import com.softcommerce.logic.LogicItem;
import com.softcommerce.logic.LogicMarca;
import com.softcommerce.logic.LogicReporte;
import com.softcommerce.tablemodel.TableModelItem;
import com.softcommerce.util.ExportarToExcel;
import com.toedter.calendar.JDateChooser;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;
public class UiFormVentaItemReportImpl extends UiFormVentaItemReport {

    public UiFormVentaItemReportImpl(java.net.URL ruta) {
        super(ruta);
    }
}
