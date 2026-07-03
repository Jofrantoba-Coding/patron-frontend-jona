package com.softcommerce.views.uiformlotemovimiento;

import com.softcommerce.beans.LoteMovimiento;
import com.softcommerce.beans.StockLaboratorio;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.LoteMovTableModel;
import com.softcommerce.general.tablas.ReservaTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.net.URL;
import java.util.Date;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import org.apache.log4j.Logger;

public class UiFormLoteMovimientoImpl extends UiFormLoteMovimiento {

    public UiFormLoteMovimientoImpl(Main frame, URL path, StockLaboratorio stockLaboratorio, Date fechaEmision, String tipoForm) {
        super(frame, path, stockLaboratorio, fechaEmision, tipoForm);
    }
}
