package com.softcommerce.views.uiformventaconversion;

import com.softcommerce.views.uiregisterventadirecta.UiRegisterVentaDirecta;

import com.softcommerce.beans.BeanVentaConversion;
import com.softcommerce.conta.tablas.TableModelVentaConversion;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnRegconta;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.FlowLayout;
import java.awt.Font;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URL;
import java.util.List;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;

public class UiFormVentaConversionImpl extends UiFormVentaConversion {

    public UiFormVentaConversionImpl(Main frame, UiRegisterVentaDirecta formVenta, BigDecimal total) {
        super(frame, formVenta, total);
    }

    public UiFormVentaConversionImpl(Main frame, String id_regconta, URL path) {
        super(frame, id_regconta, path);
    }
}

