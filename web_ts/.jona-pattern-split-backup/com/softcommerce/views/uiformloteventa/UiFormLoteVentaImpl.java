package com.softcommerce.views.uiformloteventa;

import com.softcommerce.beans.BeanRegcontaItem;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.TableModelLoteVenta;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
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
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import org.apache.log4j.Logger;

public class UiFormLoteVentaImpl extends UiFormLoteVenta {

    public UiFormLoteVentaImpl(Main frame, URL path, BeanRegcontaItem beanRci, Object objPadre, Component comp) {
        super(frame, path, beanRci, objPadre, comp);
    }

    public UiFormLoteVentaImpl(Main frame, URL path, ContaItem beanGuia, Object objPadre, Component comp) {
        super(frame, path, beanGuia, objPadre, comp);
    }
}
