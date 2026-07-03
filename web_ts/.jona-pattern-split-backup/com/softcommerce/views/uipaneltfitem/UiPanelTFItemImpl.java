package com.softcommerce.views.uipaneltfitem;

import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.TipoVentaEnum;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.ItemTableModel;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPreciosCab;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter.ComparisonType;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiPanelTFItemImpl extends UiPanelTFItem {

    public UiPanelTFItemImpl(String title, Main frame, Usuario usuario) {
        super(title, frame, usuario);
    }

    public UiPanelTFItemImpl(String title, Main frame, Usuario usuario, List<Boolean> vPermiso) {
        super(title, frame, usuario, vPermiso);
    }

    public UiPanelTFItemImpl(String title, Main frame, Usuario usuario, boolean Vendedor) {
        super(title, frame, usuario, Vendedor);
    }
}
