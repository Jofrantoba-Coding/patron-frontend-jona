package com.softcommerce.views.uipnlcierreproddespachar;

import com.softcommerce.beans.BeanItemDespachar;
import com.softcommerce.beans.BeanPeriodoMensual;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.tablas.ItemDespacharTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnItemDespachar;
import com.softcommerce.reglasnegocio.RnPeriodoMensual;
import com.softcommerce.util.ExportarToExcel;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.FlowLayout;
import java.awt.Font;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

public class UiPnlCierreProdDespacharImpl extends UiPnlCierreProdDespachar {

    public UiPnlCierreProdDespacharImpl(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, usuario, ruta, modal);
    }
}
